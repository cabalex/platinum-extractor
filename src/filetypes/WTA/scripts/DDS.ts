import { getFormatTable } from './tegrax1swizzle';
import { createProgram } from 'twgl.js';

function getDDSHeader(format: string, width: number, height: number, depth: number) {
    let fourCC, additionalHeaders: any[] = [];

    if (format === 'BC6H_UF16') {
        // DX10
        fourCC = 808540228;
        // BC6H has additional header data
        additionalHeaders = [
            0x5F,
            0x3,
            0,
            1,
            0
        ]
    } else if (format.startsWith('BC1')) {
        // DXT1
        fourCC = 827611204;
    } else if (format.startsWith('BC2')) {
        // DXT3
        fourCC = 861165636;
    } else {
        // DXT5
        fourCC = 894720068;
    }

    return Uint32Array.from([
        542327876, // magic DDS\x20
        124, // header size
        0x1 + 0x2 + 0x4 + 0x1000 + 0x20000 + 0x80000, // Defaults (caps, height, width, pixelformat) + mipmapcount and linearsize
        height,
        width,
        format == 'R8G8B8A8_UNORM' ?
            ((width + 1) >> 1) * 4 :
            Math.round(Math.max(1, ((width + 3) / 4) ) * getFormatTable(format)[0]), // pixel format
        depth, // depth
        1, // mipmap count - Setting this to the normal value breaks everything, don't do that
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // reserved[11]
        
        32, // ddpf size
        0x4, // flags
        fourCC, // fourCC
        0, 0, 0, 0, 0, // rgb bit masks
        4198408, // caps
        0, // caps2
        0, // caps3
        0, // caps4
        0, // reserved
        
        // BC6H_UF16
        ...additionalHeaders
    ]).buffer
}

/**
 * Prepends a DDS header to DDS texture data, for exporting.
 * @param format The format of the texture, e.g. "BC1_UNORM".
 * @param width Texture width
 * @param height Texture height
 * @param depth Texture depth (usually 1)
 * @param textureData An ArrayBuffer containing the texture data.
 * @returns An ArrayBuffer containing the complete file (both header and data).
 */
export function addDDSHeader(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer) {
    // Add header to data
    let ddsHeader = getDDSHeader(format, width, height, depth);
    let ddsFile = new Uint8Array(ddsHeader.byteLength + textureData.byteLength);
    ddsFile.set(new Uint8Array(ddsHeader));
    ddsFile.set(new Uint8Array(textureData), ddsHeader.byteLength);
    
    return ddsFile.buffer;
}

/**
 * Loads a DDS texture into a canvas element. Renders using WebGL.
 * @param format The format of the texture, e.g. "BC1_UNORM".
 * @param width Texture width
 * @param height Texture height
 * @param depth Texture depth (usually 1)
 * @param textureData An ArrayBuffer containing the texture data.
 * @returns A canvas element containing the texture.
 */
export function loadDDS(format: string, width: number, height: number, depth: number, textureData: ArrayBuffer) {
    let canvas = document.createElement('canvas');
    let gl = canvas.getContext('webgl');
    if (gl === null) {
        alert("Unable to initialize WebGL or Canvas2D. Your browser or machine may not support it.");
        return canvas;
    }

    canvas.width = width;
    canvas.height = height;
    
    let ext = <WEBGL_compressed_texture_s3tc>gl.getExtension('WEBGL_compressed_texture_s3tc');

    
    gl.viewport(0,0,width,height);
    //draw screenspace quad here
    const vs = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        uniform vec2 u_resolution;

        varying vec2 v_texCoord;

        void main() {
            // convert the rectangle from pixels to 0.0 to 1.0
            vec2 zeroToOne = a_position / u_resolution;

            // convert from 0->1 to 0->2
            vec2 zeroToTwo = zeroToOne * 2.0;

            // convert from 0->2 to -1->+1 (clipspace)
            vec2 clipSpace = zeroToTwo - 1.0;

            gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);

            // pass the texCoord to the fragment shader
            // The GPU will interpolate this value between points.
            v_texCoord = a_texCoord;
        }
    `;

    const fs = `
        precision mediump float;

        // our texture
        uniform sampler2D u_image;

        // the texCoords passed in from the vertex shader.
        varying vec2 v_texCoord;

        void main() {
            gl_FragColor = texture2D(u_image, v_texCoord);
        }
    `;

    var program = createProgram(gl, [vs, fs]);
    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    var x1 = 0;
    var x2 = width;
    var y1 = 0;
    var y2 = height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);

    // create and upload compressed texture
    let compressedTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, compressedTexture);

    let ddsType = format.includes("BC1") ?
        ext.COMPRESSED_RGBA_S3TC_DXT1_EXT :
        ext.COMPRESSED_RGBA_S3TC_DXT5_EXT;

    gl.compressedTexImage2D(gl.TEXTURE_2D, 0, ddsType, width, height, 0, new DataView(textureData));


    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, width, height);

    // Draw the rectangle.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

    
    // read back uncompressed color data
    let data = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, data);

    let imageData = new ImageData(new Uint8ClampedArray(data), width, height);

    let newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    let ctx = newCanvas.getContext('2d');
    if (ctx === null) {
        alert("Unable to initialize WebGL or Canvas2D. Your browser or machine may not support it.");
        return newCanvas;
    }
    ctx.putImageData(imageData, 0, 0);

    return newCanvas;
}