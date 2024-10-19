import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
});

export default compat.config({
    extends: [
        'plugin:drizzle/all',
        'prettier',
    ],
    rules: {
        'no-console': 'warn',
    },
});
