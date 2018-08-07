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
       
    },
    findProductById: function(session, productId) {
        //return this.search(`$filter=id eq '${product}'`);
        var options = {
            url: constantsList.baseURL + `/api/rest/products/${productId}?&_format=json`,
            jar:getCookies(session),
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/json',
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
    getProductDetails: function(session, productId) {
        //return this.search(`$filter=id eq '${product}'`);
        var options = {
            url: constantsList.baseURL + `/product/${productId}?&_format=json`,
            jar:getCookies(session),
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/json',
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
    completeOrder: function(session, orderId, email) {        
        var postData = {"commerce_order": `${orderId}`, "email": `${email}`};        
        
        var options = {
            url: constantsList.baseURL + `/api/rest/checkout/complete-order/${orderId}?&_format=json`,
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
            Request.patch(options, function (error, response, body) {
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
    }    
}

function getCookies(session) {
    var cookieJar = Request.jar();
    if(session.userData.drupalSession)
    {   
        var cookie = Request.cookie("" + session.userData.drupalSession);   
        cookieJar.setCookie(cookie, constantsList.baseURL);
        
    }   
    return cookieJar; 
}