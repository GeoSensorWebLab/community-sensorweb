L.DivIcon.SVGIcon.RotatingIcon = L.DivIcon.SVGIcon.extend({
    options: {
        "circleText": "",
        "className": "svg-icon",
        "circleAnchor": null, //defaults to [iconSize.x/2, iconSize.x/2]
        "circleColor": null, //defaults to color
        "circleOpacity": null, // defaults to opacity
        "circleFillColor": "rgb(255,255,255)",
        "circleFillOpacity": null, //default to opacity
        "circleRatio": 0.5,
        "circleWeight": null, //defaults to weight
        "color": "rgb(0,102,255)",
        "fillColor": null, // defaults to color
        "fillOpacity": 0.4,
        "fontColor": "rgb(0, 0, 0)",
        "fontOpacity": "1",
        "fontSize": null, // defaults to iconSize.x/4
        "iconAnchor": null, //defaults to [iconSize.x/2, iconSize.y] (point tip)
        "iconSize": L.point(32,48),
        "opacity": 1,
        "popupAnchor": null,
        "rotation": 0,
        "weight": 2
    },
    initialize: function(options) {
        options = L.Util.setOptions(this, options)
        options.circleAnchor = L.point(Number(options.iconSize.x)/2, Number(options.iconSize.y)/2)
        L.DivIcon.SVGIcon.prototype.initialize.call(this, options)

        return options
    },

    _createPath: function() {
        var pathDescription = this._createPathDescription()
        var strokeWidth = this.options.weight
        var stroke = this.options.color
        var strokeOpacity = this.options.Opacity
        var fill = this.options.fillColor
        var fillOpacity = this.options.fillOpacity
        var className = this.options.className + "-path"
        var rotation = this.options.rotation - 180

        var path = '<path class="' + className + '" d="' + pathDescription +
            '" stroke-width="' + strokeWidth + '" stroke="' + stroke + '" stroke-opacity="' + strokeOpacity +
            '" fill="' + fill + '" fill-opacity="' + fillOpacity + '" transform="rotate(' + rotation + ' 16 16)"/>'

        return path
    }
})

L.divIcon.svgIcon.rotatingIcon = function(options) {
    return new L.DivIcon.SVGIcon.RotatingIcon(options)
}

L.Marker.SVGMarker.RotatingMarker = L.Marker.SVGMarker.extend({
    options: {
        "iconFactory": L.divIcon.svgIcon.rotatingIcon
    }
})

L.marker.svgMarker.rotatingMarker = function(latlng, options) {
    return new L.Marker.SVGMarker.RotatingMarker(latlng, options)
}
