module.exports = {
    "root": true,
    "extends": [
        "eslint-config-ay",
        "eslint-config-ay/import",
        "eslint-config-ay/react",
        "eslint-config-ay/typescript",
    ],
    "parser": '@typescript-eslint/parser',
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "require-jsdoc-except/require-jsdoc": "off"
    }
}
