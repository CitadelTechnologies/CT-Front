package renderer

import(
	"os"
    "net/http"
    "io/ioutil"
    "github.com/gorilla/mux"
	"thw-front/errors"

)

type Page struct
{
	Title string
	Body []byte
}

func RenderPage(w http.ResponseWriter, r *http.Request) {

	view := mux.Vars(r)["view"]

	if view == "" {
		view = "index"
	}

	path := "web/views/" + view + ".html"

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

	file, err := ioutil.ReadFile("cdn/" + resource)
	errors.Check(err)

    w.Write(file)
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}