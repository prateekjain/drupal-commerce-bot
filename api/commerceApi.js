var Request = require("request");
var constantsList = require('../constantsList');

module.exports = {
    search: function (session, searchItem) {
        
        var options = {
            url: constantsList.baseURL + `/rest/products-search?search_api_fulltext=${searchItem}&_format=json`,
            jar:getCookies(session),
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/hal_json'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);                
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    setCookies(session, response);
                    resolve(JSON.parse(body));
                }
                else {                    
                    reject(error);
                }                
            });
        })

        // Request.get("http://httpbin.org/ip", (error, response, body) => {
        //     if (error) {
        //         return console.log(error);
        //     }
        //     console.log(JSON.parse(body));
        // });
    },
    findProductById: function(session, productId) {
        //return this.search(`$filter=id eq '${product}'`);
        var options = {
            url: constantsList.baseURL + `/rest/product/${productId}&_format=json`,
            jar:getCookies(session),
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/hal_json'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);                
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    setCookies(session, response);
                    resolve(JSON.parse(body));
                }
                else {                    
                    reject(error);
                }                
            });
        })
    },
    addToCart: function(session, productId, quantity) {        
        var postData = [{ "purchased_entity_type": "commerce_product_variation", "purchased_entity_id": `${productId}`, "quantity": `${quantity}`}];
        
        var options = {
            url: constantsList.baseURL + `/cart/add?&_format=json`,
            jar:getCookies(session),
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {                
                var info = JSON.parse(body);                
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.post(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    setCookies(session, response);
                    resolve(JSON.parse(body));
                }
                else {                    
                    reject(error);
                }                
            });
        })
    },
    getCartDetails: function(session) {
        //return this.search(`$filter=id eq '${product}'`);
        var options = {
            url: constantsList.baseURL + `/cart?_format=json`,
            jar:getCookies(session),
            headers: {                
                'Content-Type': 'application/hal_json',                
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("the response is ");
                console.log(response);                
                var info = JSON.parse(body);                
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    setCookies(session, response);
                    resolve(JSON.parse(body));
                }
                else {                    
                    reject(error);
                }                
            });
        })
    },
}

function setCookies(session, response){

    if(response.headers['set-cookie'] && !session.userData.drupalSession) {
        session.userData.drupalSession = response.headers['set-cookie'];
        console.log("session drupal -----------------------------------------------");
        console.log(session.userData.drupalSession);
    }    
}

function getCookies(session) {
    var cookieJar = Request.jar();
    if(session.userData.drupalSession)
    {   
        console.log("getting session drupal");
        console.log(session.userData.drupalSession);
        var cookie = Request.cookie("" + session.userData.drupalSession);   
        cookieJar.setCookie(cookie, constantsList.baseURL);
        
    }   
    return cookieJar; 
}