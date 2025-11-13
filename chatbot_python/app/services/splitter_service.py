from langchain.text_splitter import RecursiveCharacterTextSplitter


class SplitterService:
    def __init__(self):
        pass

    def split(self, documents):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )

        chunks = splitter.split_documents(documents)

        return chunks
