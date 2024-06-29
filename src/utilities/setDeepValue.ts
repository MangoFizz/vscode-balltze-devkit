
export default function setDeepValue(obj: { [key: string]: any }, path: string, value: any) {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (i === keys.length - 1) {
            current[key] = value;
        } else {
            if (!current[key]) {
                current[key] = isNaN(keys[i + 1] as any) ? {} : [];
            }
            current = current[key];
        }
    }

    return obj;
}
