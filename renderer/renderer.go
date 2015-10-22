package renderer

import(
    "runtime"
    "os"
    "net/http"
    "io/ioutil"
    "github.com/gorilla/mux"
    "ct-front/errors"
)

type (
    Configuration struct {
        Root string
        PathSeparator string
    }
    Page struct
    {
        Title string
        Body []byte
    }
)

var Config Configuration

func init() {

    if runtime.GOOS == "windows" {
            Config.PathSeparator = "\\"
    } else {
            Config.PathSeparator = "/"
    }
    Config.Root = os.Getenv("GOPATH") + Config.PathSeparator + "src" + Config.PathSeparator + "thw-front" + Config.PathSeparator

}

func RenderPage(w http.ResponseWriter, r *http.Request) {

    view := mux.Vars(r)["view"]

    if view == "" {
            view = "index"
    }

    path := Config.Root + "web" + Config.PathSeparator + "views" + Config.PathSeparator + view + ".html"

    if fileExists(path) != true {
            w.WriteHeader(http.StatusNotFound)
            return
    }

    template, err := ioutil.ReadFile(path)
    errors.Check(err)

    w.Write(template)
}

func RenderResource(w http.ResponseWriter, r *http.Request) {

    resource := mux.Vars(r)["resource"]
    resourceType := mux.Vars(r)["type"]

    path := Config.Root + "web" + Config.PathSeparator + "resources" + Config.PathSeparator + resourceType + Config.PathSeparator + resource

    if fileExists(path) != true {
            w.WriteHeader(http.StatusNotFound)
            return
    }

    file, err := ioutil.ReadFile(path)
    errors.Check(err)

    w.Header().Set("Content-Type", "text/" + resourceType)
    w.Write(file)
}

func fileExists(path string) bool {
    _, err := os.Stat(path)
    return err == nil
}