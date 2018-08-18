var GoogleMap = (function() {
    var GoogleMap = function() {
        this._json_data = null;
    }

    var p = GoogleMap.prototype

    p.getDistance = function() {
        console.log(this.json_data == null)
        var distance = this.json_data.routes[0].legs[0].distance.value;
        console.log("The distance is " + distance + " [m].");
    }

    p.getJson = function() {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 200){
                this.json_data = JSON.parse(req.responseText);
                console.log("JSON data chatched");
            }
        };
        req.open("GET",
                 "https://maps.googleapis.com/maps/api/directions/json?"
                 + "origin=%E6%9D%B1%E4%BA%AC%E9%A7%85" + "&"
                 + "destination=%E6%B5%85%E8%8D%89%E9%A7%85" + "&"
                 + "key=AIzaSyDFDIYBco398B-xvcJ9ND0ENWlk1vifgPs", false);
        req.send(null);
    }

    return GoogleMap;
})()
