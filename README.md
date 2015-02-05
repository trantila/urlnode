URLNode
=======

An awesome URL shortener running on node.js

About
-----

URLNode is a very, *very*, barebones URL shortener. It lets you store an URL for
"shorting" in *non-persistent memory* (lasts around an hour in
[Heroku](https://devcenter.heroku.com/)).

There is also absolutely no way to choose the shortened URL. In other words,
the created URL is always random and consist of [a-z0-9]. Collisions are handled
brutally but shouldn't cause too much problems. Additionally, nothing is done to
check the DB for existing links to certain URLs - not a big in small scale, but
a proper hashing mechanism for storing the URLs would make this quite simple.

Finally, CORS is globally allowed.


API
---

**POST** /shorten <br/>
**Parameters:** link should contain the link to shorten. <br/>
**Returns:** Id for the shortened link in text/plain format. <br/>
**Errors:** _400_ for missing parameters and _500_ for failed ID generation. <br/>

**GET** /{id} <br/>
**Returns:** _301_ redirects to a previously stored URL. <br/>
**Errors:** _404_ error if no link is stored with given id. <br/>
