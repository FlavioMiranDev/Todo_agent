from langchain_community.document_loaders import PyPDFLoader


class FileReaderService:
    def __init__(self):
        pass

    def read_pdf(self, path: str):
        loader = PyPDFLoader(path)
        documents = loader.load()

        return documents
