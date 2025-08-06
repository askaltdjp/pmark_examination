import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_KEY);

/**
 * JWTのペイロード型。
 * - jose の JWTPayload を継承しているため、setIssuedAt などにも対応。
 */
export interface JwtPayload extends JWTPayload {
    employeeId: number;
}

/**
 * JWT を発行する
 * @param payload - { employeeId: number } を含むオブジェクト
 * @param expiresIn - 有効期限（秒）。デフォルトは3600（1時間）
 */
export async function signJwt(payload: JwtPayload, expiresIn: number = 3600): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresIn;

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
        .setIssuedAt(now)
        .setExpirationTime(exp)
        .sign(JWT_SECRET);
}

/**
 * JWT を検証し、ペイロード（employeeId含む）を返す
 * @param token - JWT トークン文字列
 * @returns JwtPayload（or null）
 */
export async function verifyJwt(token: string): Promise<JwtPayload | null> {
    try {
        console.log(token);
        const { payload } = await jwtVerify(token, JWT_SECRET, {
            algorithms: ['HS256'],
        });
        return payload as JwtPayload;
    } catch (err) {
        console.error('JWT verify error:', err);
        return null;
    }
}
