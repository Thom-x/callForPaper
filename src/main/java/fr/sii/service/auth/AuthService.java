package fr.sii.service.auth;

import com.nimbusds.jose.JOSEException;
import fr.sii.domain.token.Token;
import fr.sii.domain.user.User;
import fr.sii.service.user.UserService;
import org.apache.commons.lang.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

/**
 * Created by tmaugin on 15/05/2015.
 */
public class AuthService {

    UserService userService;

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    /**
     * Return JWT token and eventually persist user according to providerId and provider
     * @param res
     * @param req
     * @param provider
     * @param providerId
     * @param email
     * @return JWT Token
     * @throws IOException
     * @throws ParseException
     * @throws JOSEException
     */
    public Token processUser(HttpServletResponse res, HttpServletRequest req, User.Provider provider, String providerId, String email) throws IOException, ParseException, JOSEException {

        final String CONFLICT_MSG = "There is already a %s account that belongs to you",CONFLICT_MSG_2 = "There is already an email associated with this account",
                NOT_FOUND_MSG = "User not found", LOGING_ERROR_MSG = "Wrong email and/or password",
                UNLINK_ERROR_MSG = "Could not unlink %s account because it is your only sign-in method";

        Token token = null;
        User user = userService.findByProvider(provider, providerId);

        // If user is already signed in then link accounts.
        User userToSave;
        String authHeader = req.getHeader(AuthUtils.AUTH_HEADER_KEY);
        if (StringUtils.isNotBlank(authHeader)) {

            String subject = AuthUtils.getSubject(authHeader);

            if (user != null && user.getEntityId() != Long.parseLong(subject)) {
                res.setStatus(HttpServletResponse.SC_CONFLICT);
                res.getWriter().write(String.format(CONFLICT_MSG, provider.capitalize()));
                res.getWriter().flush();
                res.getWriter().close();
                return token;
            }

            User foundUser = userService.findById(Long.parseLong(subject));
            if (foundUser == null) {
                res.setStatus(HttpServletResponse.SC_NOT_FOUND);
                res.getWriter().write(NOT_FOUND_MSG);
                res.getWriter().flush();
                res.getWriter().close();
                return token;
            }

            userToSave = foundUser;
            userToSave.setProviderId(provider, providerId);
            if (userToSave.getEmail() == null) {
                userToSave.setEmail(email);
            }
            //userToSave = userService.save(userToSave);
            userToSave = userService.put(userToSave.getEntityId(), userToSave);
        } else {
            // Create a new user account or return an existing one.
            if (user != null) {
                // Actually not saved
                userToSave = user;
            } else {
                // if email already taken
                user = null;
                user = userService.findByemail(email);
                if(user != null)
                {
                    res.setStatus(HttpServletResponse.SC_CONFLICT);
                    res.getWriter().write(String.format(CONFLICT_MSG_2, provider.capitalize()));
                    res.getWriter().flush();
                    res.getWriter().close();
                    return token;
                }
                userToSave = new User();
                userToSave.setVerified(true);
                userToSave.setProviderId(provider, providerId);
                userToSave.setEmail(email);
                userToSave = userService.save(userToSave);
            }
        }
        token = AuthUtils.createToken(req.getRemoteHost(), userToSave.getEntityId().toString(), true);
        return token;
    }
}
