import { randomBytes,scrypt } from "crypto";

export const hash: (password: string) => Promise<{salt: string, derivedKey: string}> = async (password: string) => {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(16).toString("hex")
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve({salt, derivedKey: derivedKey.toString('hex')})
        });
    })
}

export const verify = (plainPW: string, hashedPW: string, salt: string) => {
    return new Promise((resolve, reject) => {
        scrypt(plainPW, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(hashedPW == derivedKey.toString('hex'))
        });
    })
}