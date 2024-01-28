import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function App() {
  const [data, setData] = useState<ArrayBuffer>(new ArrayBuffer(0));
  const [numPages, setNumPages] = useState<number>();
  const [numPages2, setNumPages2] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumber2, setPageNumber2] = useState<number>(1);

  function onDocumentLoadSuccessServer({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onDocumentLoadSuccessDirect({ numPages }: { numPages: number }): void {
    setNumPages2(numPages);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-pdf");
        if (!response.ok) {
          throw new Error("Bad response");
        }

        const result: ArrayBuffer = await response.arrayBuffer();
        setData(result);
      } catch (error) {
        console.error("Error fetching data");
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {data && (
        <div style={{ marginRight: "20px" }}>
          <h2>From server api call</h2>
          <Document file={data} onLoadSuccess={onDocumentLoadSuccessServer}>
            {Array.from(Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
        </div>
      )}

      <div>
        <h2>Directly from URL</h2>
        <Document file={'./sample.pdf'} onLoadSuccess={onDocumentLoadSuccessDirect}>
            {Array.from(new Array(numPages2), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
              />
            ))}
          </Document>
      </div>
    </div>
  );
}

export default App;
