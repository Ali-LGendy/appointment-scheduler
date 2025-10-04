import * as authService from "../services/authService"

const cookieOpition = () => {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: (() => {
            const v = process.env.JWT_REFRESH_EXPIRY;

            const unit = v.slice(-1);
            const num = parseInt(v.slice(0, -1), 10);
            if (unit === 'd') return num * 24 * 60 * 60 * 1000;
            if (unit === 'h') return num * 60 * 60 * 1000;
            if (unit === 'm') return num * 60 * 1000;
            return num * 1000;
        })(),
    };
}

export const logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await await authService.login({ email, password });
        const { accessToken, refreshToken } = user;
        
        res.cookie('refreshToken', refreshToken, cookieOpition());
        res.status(200).json({
            message: "Login successfull",
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch(err) {
        next(err);
    }
}

export const register = async (req, res, next) => {
    try{
        const { email, password, name, role, service_type } = req.body;
        const user = await authService.register({email, password, name, role, service_type});
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch(err) {
        next(err);
    }

}

export const logOut = async (req, res, next) => {
    try{
        const { refreshToken } = req.cookie?.refreshToken;
        if(refreshToken){
            await authService.logOut({presentedToken: refreshToken});
            req.clearCookie('refreshToken');

            res.json({success: true});
        }
        else {
            res.status(400).json({ message: "Refresh token not provided" });
        }
    } catch(err) {
        next(err);
    }
}

export const refresh = async (reqq, res, next) => {
    try{
        const refreshToken = req.cookie?.refreshToken;
        if(!refreshToken) {
            res.status(401).json({ message: "Refresh token not provided" });
        }

        const { accessToken, refreshToken: newRefresh, user } = await authService.refreshToken({ presentedToken: refreshToken });
        
        res.cookie('refreshToken', newRefresh, cookieOpition());
        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch {
        next(err);
    }
}