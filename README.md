# @nxframework/nx-http-client

### A http client based on fetch

## Feature

- Based on Promise

- MethodChaining

- Automatic file upload

- Easy to use

## Getting Started

- Copy source code

    First, you need to copy src/index.ts into your project

- Import 'NxHttpClient'

``` typescript
import NxHttpClient, { Method } from 'nx-http-client'
```

- Simple request

``` typescript
// this is async function
public async handleBtnClick() {
    /**
     * new NxHttpClient(url: string, method: Method)
     * 
     * url: request url
     * method: request method, enumerated from 'Method'
     */
    const res = await new NxHttpClient('/api/user/{id}').build().sendAsync()
    console.log(res)
}

// you can process yourself
public function handleBtnClick() {
    /**
     * send method will return fetch()
     * so you can do what you need
     */
    new NxHttpClient('/api/user/{id}').build().send().then(res => {
        res.json()
    }).then(data => {
        console.log(data)
    })
}
```

- Add request params

``` typescript
// you can use addParams to add request params
public async handleBtnClick() {
    const res = await new NxHttpClient('/api/user', Method.POST)
    .addParams({
        _id: 1,
        name: "404 Not Found."
    }).build().sendAsync()
    console.log(res)
}
```

- Add request headers

``` typescript
/**
 * Note that: 
 * For GET method,params will be parsed into url string
 * Like this:
 *      https://www.baidu.com  params: { wd: "kotlin" }
 *      -> https://www.baidu.com/?wd=kotlin
 * For another method,NxHttpClient will automatic add 'appliciton/json' into headers
 * You can custom it by addHeaders()
 */
public async handleBtnClick() {
    const res = await new NxHttpClient('/api/user', Method.PUT)
    .addHeaders({
        'Accept': 'application/json',
        'Content-Type': 'x-www-form-urlencoded'
    })
    .addParams({
        _id: 0,
        name: "404 Not Found."
    })
}
```

- Also you can upload file/files

``` typescript
export default class App extends React.Component {

    private fileSelector: any = React.createRef<HTMLElement>()

    render() {
        return (
            <div>
                <input type="file" ref={this.fileSelector} multiple={true}>
                <button onClick={this.handleBtnClick.bind(this)}>UPLOAD</button>
            <div/>
        )
    }

    private async handleBtnClick() {
        const res = new NxHttpClient('/api/upload/multi', Method.POST)
        // you can add params in the same times
        .addParams({
            name: "xxxxx"
        })
        // file tag corresponding backend receiving parameters
        .createFileTag("files")
        // you can addFiles() or addFile()
        .addFiles(this.fileSelector.current.files).build().sendAsync()
        console.log(res)
    }
}
```

### Do not add headers if you wanted to upload file/files!!!!!!!

## This is all about that,sorry my english is not ok.
## If you have any confused,welcome to commit issures.