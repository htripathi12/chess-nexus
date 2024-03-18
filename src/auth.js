function OAuth2Callback() {
    generatePKCECodes().then(codes => {
        console.log('Code Verifier:', codes.codeVerifier);
        console.log('Code Challenge:', codes.codeChallenge);
    });
}
////

function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function sha256(buffer) {
    return crypto.subtle.digest('SHA-256', buffer);
}

async function generatePKCECodes() {
    const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~'[b % 64])
        .join('');
    const hashed = await sha256(new TextEncoder().encode(codeVerifier));
    const codeChallenge = base64URLEncode(new Uint8Array(hashed));
    
    return { codeVerifier, codeChallenge };
}

export default OAuth2Callback;