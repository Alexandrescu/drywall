'use strict';

exports.init = function(req, res){
  if (req.isAuthenticated()) {
  	// Connect 
  	console.log(req.user);
    res.render('account/index');

  }
  else {
    res.render('login/index', {
      oauthMessage: '',
      oauthTwitter: !!req.app.get('twitter-oauth-key'),
      oauthGitHub: !!req.app.get('github-oauth-key'),
      oauthFacebook: !!req.app.get('facebook-oauth-key'),
      oauthGoogle: !!req.app.get('google-oauth-key')
    });
  }
};
