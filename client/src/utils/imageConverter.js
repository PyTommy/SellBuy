export default (buffer) => {
    if (!buffer) {
        return require('../assets/default.png');
    }
    let binary = '';
    const bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return `data:image/jpeg;base64,${window.btoa(binary)}`;
};