export enum Method {
    GET = "GET", POST = "POST", PUT = "PUT", UPDATE = "UPDATE", DELETE = "DELETE"
}

export default class NxHttpClient {
    private url!: string
    private options: RequestInit = {}
    private params?: any
    private files?: any
    private fileTag?: string

    constructor(baseUrl: string, method: Method) {
        this.url = baseUrl
        this.options.method = method
    }

    /**
     * Add custom headers into request body
     * @param headers headers will send to backend
     * @return NxHttpClient
     */
    public addHeaders(headers: HeadersInit) {
        this.options.headers = headers
        return this
    }

    /**
     * Delete headers cookies
     * @return NxHttpClient
     */
    public withoutCookie() {
        this.options.credentials = "omit"
        return this
    }

    /**
     * Add params into request body
     * @param params params will send to backend
     * @return NxHttpClient
     */
    public addParams(params: any) {
        if (this.options.method === "GET") {
            // connect url string
            let _params = "?"
            Object.keys(params).forEach(item => {
                _params += `${ item }=${ params[item] }&`
            })
            this.url += _params
        } else {
            // cache post params
            this.params = params
            this.options.body = JSON.stringify(params)
        }
        return this
    }

    /**
     * Create file tag before uploading files
     * FileTag will mapping to backends files object param
     * @param fileTag files object param
     * @return NxHttpClient
     */
    public createFileTag(fileTag: string) {
        this.fileTag = fileTag
        return this
    }

    /**
     * Append file into request body with file tag
     * @param file a file will be appended into body params
     * @return NxHttpClient
     */
    public addFile(file: File) {
        this.files = new FormData()
        this.files.append(this.fileTag, file, file.name)
        return this
    }

    /**
     * Append files into request body with file tag
     * @param files files will append to body params
     * @return NxHttpClient
     */
    public addFiles(files: FileList) {
        this.files = new FormData()
        for (let index = 0; index < files.length; index++) {
            this.files.append(this.fileTag, files[index], files[index].name)
        }
        return this
    }

    /**
     * Build the whole request,
     * Please use build() before send() or sendAsync()
     * @return NxHttpClient
     */
    public build() {
        /**
         * Deal with extra service
         * Request method is not GET and without upload files
         * Then add default request headers
         */
        if (!this.options.headers && this.options.method !== "GET" && !this.files) {
            this.options.headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        return this
    }

    /**
     * Send request, get response
     * return Promise<Response> response
     */
    public send(): Promise<Response> {
        // there are files in request params
        if (this.files) {
            Object.keys(this.params).forEach(key => {
                this.files.append(key, this.params[key])
            })
            this.options.body = this.files
        }
        return fetch(this.url, this.options)
    }

    /**
     * Send request async, automatic parse JSON object
     * @return Object JSON.parse(res)
     */
    public async sendAsync() {
        return await this.send().then(res => res.json())
    }

}