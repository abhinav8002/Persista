import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { response_401, response_500 } from "../../utils/responseCodes.js";
import prisma from "../../config/db.config.js";
dotenv.config();

const secretKey = process.env.SECRET;
const successLoginUrl = process.env.SUCCESS_LOGIN_URL;
const errorLoginUrl = process.env.ERROR_LOGIN_URL;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, profile, cb) => {
			try {
				let user = await prisma.user.findUnique({
                    where: {
                        email: profile.emails[0].value,
                    },
                });

				if (user) {
					console.log(user);
					return cb(null, user);
				}

				const defaultUser = {
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					email: profile.emails[0].value,
					picture: profile.photos[0].value,
				};

				user = await prisma.user.create({
					data: defaultUser,
				});

				return cb(null, user);
			} catch (err) {
				console.log("Error signing up", err);
				return cb(err, null);
			}
		}
	)
);

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
	try {
		const user = await prisma.user.findUnique(
            {
                where: {
                    id
                },
            }
        );
		if (user) {
			return cb(null, user);
		} else {
			return cb(null, false);
		}
	} catch (err) {
		console.log("Error deserializing", err);
		return cb(err, null);
	}
});

export const googleLogin = passport.authenticate("google", {
	scope: ["profile", "email"],
});

export const googleCallback = passport.authenticate("google", {
	failureMessage: "Cannot login to Google, please try again later!",
	session: false,
	failureRedirect: errorLoginUrl,
});

export const handleGoogleCallback = (req, res) => {
	const { email } = req.user;
	const token = jwt.sign({ email, id: req.user.id }, secretKey, {
		expiresIn: "1d",
	});
	res.redirect(`${successLoginUrl}/${token}`);
};
