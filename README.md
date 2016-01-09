# socks_nw

--------------------------------------------------------------------------------

shadowsocks implement by node and nw.js

# run by cmd

- fork this repo.
- install node.js.ONLY TEST IN NODE THAT VERTION UPPER THAN v4.0.so if you use the lower version.please update your node.js
- run

  ```js
       npm install
       node index.js
  ```

# run by GUI

the gui version based on NW.js.

just download the version for your operating system

windows

mac osx

linux

# config.json sepcs

you must-define fileds below

```js
    {
        "host":"128.199.110.63",
        "port":"9183",
        "passwd":"Huangyao1"
    }
```

## host

remote server ip address

## port

the port number use by remote server

## local_port

the local_port shadowsocks_nw listen on.default is 1080

## method

the crypto method use to package the data.default is aes-256-cfb

support method below

```js
    aes-128-cfb
    aes-192-cfb
    aes-256-cfb
    bf-cfb
    camellia-128-cfb
    camellia-192-cfb
    camellia-256-cfb
    cast5-cfb
    des-cfb
    idea-cfb
    rc2-cfb
    rc4
    rc4-md5
    seed-cfb
```

# FOR DEV

- how to package the source code to nw.js

   just check this article

   [How-to-package-and-distribute-your-apps](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps)

- where is the protocol sepcs

   [SOCKS Protocol Version 5](https://www.ietf.org/rfc/rfc1928.txt)

   [shadowsocks Protocol based in socks5](https://shadowsocks.org/en/spec/protocol.html)

- show debug msg in console

    just set you env value DEBUG=tcp.then run the program via cmd.will show the debug msg.run by node or nw both ok.but in when run by nw.the debug msg write in page will show in nw console.the debug msg in node will show in terminal.

- report an issue or pull request  will be thankful!
