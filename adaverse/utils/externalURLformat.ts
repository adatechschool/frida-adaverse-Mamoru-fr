export function externalURLformat(url: string) {
    return url.startsWith('http') ? url : `https://${url}`;
}