if (window.location.href == "http://localhost:4000/release") {
  document.getElementById("uploadButton").addEventListener("click", upload);

  function upload(e) {
    e.preventDefault();

    const doc = document.querySelector('input[type="file"]');
    const des = document.getElementById("description").value;

    const progress_Bar = document.querySelector(".progress-bar");
    progress_Bar.setAttribute("id", "play-animation");

    console.log(doc.files[0]);
    console.log(des);

    const form_Data = new FormData();
    form_Data.append("document", doc.files[0]);
    form_Data.append("description", des);

    fetch("http://localhost:4000/release", {
      method: "post",
      body: form_Data,
    })
      .then((response) => {
        response.json();
        console.log(response);
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }
} else if (window.location.href == "http://localhost:4000/docs") {
  window.addEventListener("load", download);

  async function download() {
    const divs = document.querySelectorAll(".dDiv");

    for (let i = 0; i < divs.length; i++) {
      const ids = divs[i].dataset.id;

      const response = await fetch(`http://localhost:4000/docs/${ids}`, {
        method: "get",
      });

      const data = await response.arrayBuffer();

      const a_Tag = divs[i].children[0].children[0];

      a_Tag.setAttribute(
        "href",
        URL.createObjectURL(
          new Blob([data], {
            type: "application/pdf",
          })
        )
      );
      a_Tag.setAttribute("download", a_Tag.textContent);
    }
  }
}
