//Promise
//Код в js выполняется последовательно(в одном потоке, синхронно)
//т.е. таким образом, когда каждая следующая операция ждет завершения предыдущей

//Асинхронный код в JS может быть написан разными способами: с помощью обратных вызовов, обещаний ключевых слов (async, await)
//Callback hell
//Есть ряд асинхронных задач, которые зависят друг от друга, т е первая задача запускает по завершению вторую, вторая-третью и т д
//И мы получаем башню из обратных вызовов
//Решает эту проблему Promise
//callback hell:
setTimeout(() => {
    console.log(1)
    setTimeout(() => {
        console.log(2)
        setTimeout(() => {
            console.log(3)
            setTimeout(() => {
                console.log(4)
            }, 5000)
        }, 5000)
    }, 5000)
}, 5000)

//Промис - это объект. Отправляем запрос на сервер - не знаем: ответит, не ответит, ответит с ошибкой, какие данные пришлетБ с помощью промиса - поставим ответ на ожидание - получим - будем обрабатывать
//Промисы позволяют обрабатывать асинхронные операции
// создать
const Promise = new Promise((resolve, reject) => {
//    выполнение асинхронных действий
//    внутри этой функции нужно в результате вызвать одну из функций resolve() или reject()
})

function makeServerRequest() {
    return new Promise((resolve, reject) => {
        //    Сумуляция синхронного запроса к серверу
        setTimeout(() => {
            const response = {
                status: 200,
                data: 'Response data from server'
            }
            if (response.status === 200) {
                resolve(response.data)
            } else {
                reject('Server request failed')
            }
        }, 2000)
    })
}

function delayedPropmise() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const randomNumber = Math.random()
            if (randomNumber > 0.5) {
                resolve(`Random number ${randomNumber} is greater than 0.5`)
            } else {
                reject(`Random number ${randomNumber} is less or equal than 0.5`)
            }
        }, 2000)
    })
}

//использование промиса
delayedPropmise()
    .then(result => {
        console.log('Resolve:', result)
    })
    .catch(error => {
        console.log('Reject', error)
    })

//Промис возвращает либо результат, либо ошибку
// console.log(typeof Promise.resolve()) - object

//Св-ва: state(состояние): - когжа объект создается у него будет состояние pending(ожидание) лиюо результат
//Когда промис вернул какой-то результат он считается исполненным - fulfilled (выполнен успешно) либо отклоненным (rejected)
//Первое состояние промиса окончательно и он не изменяет на другое состояние. С fulfilled нельзя перейти, например, на др и наоборот
//result: промис в состоянии ожидания имеет undefined, rejected - result=error, fulfilled - result = value

//Параметры - коллбэк, который принимает 2 параметра - resolve и reject
//


//Then, catch, finally
//У объекта, созданного через конструктор Promise доступны метода(Then, catch, finally)
//

const promise11 = new Promise((resolve, reject) => {
})

promise11.then(value => {
//  действия в случае успешного исполнения промиса
//    значением value является значение, переданное в вызове функции resolve внутри промиса
//
}).catch(error => {
//    действия в случае отклонения промиса
//    значением error является значение, переданное в вызове функции reject внутри промиса
}).finally() //ничего не принимает, выполнится в любом случае, ничего не возвращает ()

//Цепочка промисов
//Иногда количество асинхронных операций заранее неизвестно, но они должны выполняться строго по очереди
//Цепочка промисов это всегда then().then().then()
//Единственный нюанс - начальный промис, с которого начинается строится цепочка. Если такого промиса нет, то его можно создать используя функцию Promise.resolve(). Он возвращает промис, который ничего не делает, но с него можно начинать свёртку
const prpr1 = Promise.resolve('Resolve')
const prpr2 = prpr1.then(data => console.log('yes'))
const prpr3 = prpr2.then(data => console.log('server answer'))

fetch('/ghjk/user.json')
    .then(response => response.json())
    .then(user => alert(user.name))

//Запрашиваем user.json
fetch('/ghjk/user.json')
    //загружаем данные в формате json
    .then(response => response.json())
    //делаем запрос а github
    .then(user => fetch('/fghjk/${user.name}'))
    //загружаем ответ в формате json
    .then(response => response.json())
    //показываем аватар в течени 3 сек
    .then(gitHubUser => {
        let img = document.createElement('img')
        img.src = gitHubUser.avatar_url
        img.className = 'propmise-avatar-example'
        document.body.append(img)
        setTimeout(() => img.remove(), 3000)
    })

//Если обработчик в .then (catch/finally) возвращает промис, последующие элементы цепочки ждут, пока этот промис выполнится. КОгда это происходит, результат его выполнения (или ошибка) передается дальше
//Или, может быть, с сервером все в порядке, но в ответе мы получим некорректный JSON. Исправить - добавить catch в конец цепочки

fetch('/ghjk/user.json')
    .then(response => response.json())
    .then(user => fetch('/fghjk/${user.name}'))
    .then(response => response.json())
    .then(gitHubUser => new Promise((resolve, reject) => {
        let img = document.createElement('img')
        img.src = gitHubUser.avatar_url
        img.className = 'propmise-avatar-example'
        document.body.append(img)
        setTimeout(() => {
            img.remove()
            resolve(gitHubUser)
        }, 3000)
    }))
    .catch(error => alert(error.message))

// _onResponse(res) { //обрабатываем ответ сервера
//  return res.ok ? res.json() : Propmise.reject({...re, message: 'Ошибка сервера'})
//}

//getAllCats() { //у сервера запрашиваем всех котов
//  return fetch (${this._url}/show, {
//      method: 'GET'
//  }).then(this._onResponse)
//
//Классическая ошибка новичков: технически возможно добавить много обработчиков .then  к единственному запросу
//
const promise6 = Promise.resolve(5)
    .then((value) => `${value} and bar`)
    .then((value) => `${value} and bar again`)
    .then((value) => `${value} and again`)
    .then((value) => `${value} and again`)
    .then((value) => {
        console.log(value) //зарезолвится undefined, потому что ничего не возвращаем
        //return undefined
    })
    .catch((err) => {
        console.log(err)
        //return undefined
    })

let promise2 = new Promise(function (resolve, reject) {
    resolve(1)
    reject(3) //работать не будет, потому что уже зарезолвился
    setTimeout(() => resolve(2), 1000) //второй resolve игнорирует, потому что он уже зарезолвился
})

promise2.then(alert)

const promise4 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(1), 1000)
}).then(function (result) {
    console.log(result)
    return result * 2
}).then(function (result) {
    console.log(result)
    return result * 2
}).then(function (result) {
    console.log(result)
    return result * 2 //8
}).then(function (result) {
    result * 2
    console.log(result)
    //resolve undefined
}).then(function (result) {
    console.log(result)
    //resolve undefined
})

Promise.reject('a')//ошибка
    .catch(p => p + 'b')//ab - промис резолвится
    .catch(p => p + 'c')//пропускает, потому что был resolve
    .then(p => p + 'd')//abd
    .finally(p => p + 'e')//не принимает ничего - undefined - не изменяет резльтаты
    .then(p => console.log(p))//abd

const propmise7 = Promise.reject('error')
.then(res=> {
    console.log(res)
    return res
})
.catch(err=> {
    console.log(err)
    return err
})
.then(res=> {
    return res + '' + 'request server'
})