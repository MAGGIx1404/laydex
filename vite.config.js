import { defineConfig } from 'vite'
import vituum from 'vituum'
import pug from '@vituum/vite-plugin-pug'

export default defineConfig({
    plugins: [
        vituum({
            imports: {
                filenamePattern: {
                    '+.css': [],
                    '+.scss': [],
                },
            },
        }),
        pug({
            root: './src',
        }),
    ],
})
