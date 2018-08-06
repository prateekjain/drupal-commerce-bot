var Request = require("request");
var constantsList = require('../constantsList');

module.exports = {
    search: function (searchItem) {
        
        var options = {
            url: constantsList.baseURL + `/rest/products-search?search_api_fulltext=${searchItem}&_format=json`,
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/hal_json'
            }
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log("in here");
                var info = JSON.parse(body);
                console.log(info);
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("----Success---");
                    //console.log(JSON.parse(body));
                    resolve(JSON.parse(body));
                }
                else {
                    console.log("----Failure----");
                    console.log(error);
                    console.log(response.statusCode);
                    //console.log(response);
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
    findProductById: function(productId) {
        //return this.search(`$filter=id eq '${product}'`);
        var options = {
            url: constantsList.baseURL + `/rest/product/${productId}&_format=json`,
            headers: {
                //'Authorization': 'Basic YWRtaW46YWRtaW4=',
                'Content-Type': 'application/hal_json'
            }
        };

        console.log(options.url);

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log("in here");
                var info = JSON.parse(body);
                console.log(info);
                return info;
            }
            return;
        }

        return new Promise(function (resolve, reject) {
            Request.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("----Success---");
                    //console.log(JSON.parse(body));
                    resolve(JSON.parse(body));
                }
                else {
                    console.log("----Failure----");
                    console.log(error);
                    console.log(response.statusCode);
                    //console.log(response);
                    reject(error);
                }                
            });
        })
    },
}