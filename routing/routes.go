package routing

import(
    "net/http"
    "thw-front/renderer"
)

type Route struct {
    Name        string
    Method      string
    Pattern     string
    HandlerFunc http.HandlerFunc
}

type Routes []Route

var routes = Routes{
    Route{
        "Get page",
        "GET",
        "/{view}",
        renderer.RenderPage,
    },
    Route{
        "Get resource",
        "GET",
        "/cdn/{resource}",
        renderer.RenderResource,
    },
}