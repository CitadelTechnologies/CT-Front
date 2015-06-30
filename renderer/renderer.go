package renderer

import(
    "net/http"
    "io/ioutil"
    "github.com/gorilla/mux"
	"8thw-front/errors"

)

type Page struct
{
	Title string
	Body []byte
}

func RenderPage(w http.ResponseWriter, r *http.Request) {

	view := mux.Vars(r)["view"]

    template, err := ioutil.ReadFile("web/views/" + view)
    errors.Check(err)

    w.Write(template)
}

func RenderResource(w http.ResponseWriter, r *http.Request) {

	resource := mux.Vars(r)["resource"]

	file, err := ioutil.ReadFile("cdn/" + resource)
	errors.Check(err)

    w.Write(file)
}