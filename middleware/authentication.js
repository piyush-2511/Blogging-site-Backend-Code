const { validateToken } = require('../services/authentication.js');

function checkForAuthenticationCookie(cookieName){
  return function (req, res, next){
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      return next();  // Return here to stop further execution
    }
    try{
      const userPayload = validateToken(tokenCookieValue)
      req.user = userPayload
      console.log(req.user)
    }catch(error){
      // Handle error appropriately
    }
    return next();
  }
}


module.exports = {
  checkForAuthenticationCookie,

}