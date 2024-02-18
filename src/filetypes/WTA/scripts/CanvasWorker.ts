import { WTATexture } from "../extract";

self.onmessage = (e) => {
    const canvas = e.data.canvas;
    const texture = WTATexture.recreate(e.data.texture);

    texture.load(e.data.wtpFile, canvas);
}

console.log('Hello world!');
