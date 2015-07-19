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
        "Get index",
        "GET",
        "/",
        renderer.RenderPage,
    },
    Route{
        "Get resource",
        "GET",
        "/cdn/{type}/{resource}",
        renderer.RenderResource,
    },
    Route{
        "Get page",
        "GET",
        "/app/{view}",
        renderer.RenderPage,
    },
}