// config.js

const { OPENAI_API_KEY } = "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"

if (!OPENAI_API_KEY) {
    throw new Error('⚠️  Missing OPENAI_API_KEY in environment variables')
}