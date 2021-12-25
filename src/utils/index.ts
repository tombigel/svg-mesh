const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export function createId(length: number) {
    let result = '';
    for (var i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * charactersLength)];
    }
    return result;
}

export function clamp(min: number, max: number, x: number): number {
    return Math.min(max, Math.max(min, x));
  }