
let userForm = document.getElementById('userForm')
let title = document.getElementById('title')
let body = document.getElementById('body')
let userId = document.getElementById('userId')
const postContainer =document.getElementById('postContainer')
const sBtn = document.getElementById('sBtn')
const uBtn = document.getElementById('uBtn')



let baseurl = `https://fetch-b5233-default-rtdb.asia-southeast1.firebasedatabase.app/`;


let posturl = `${baseurl}/posts.json`;

const apiCall = async (apiUrl,methodName,msgbody)=>{ 
let res = await fetch(apiUrl,{ // fetch returns promise so to consume promise we used await keyword.
    // await will block the fetch function and will consume to promise. 
        method:methodName,
        body:msgbody,
        headers:{
            'Content-type':'application/json'
        }
    })
    console.log(res);// here res is response so json() will be used on this response.
    return await res.json() // json() returns promise so here await is used before calling promise function inside async 

}
 const getPosts =async()=>{
    try{
        let data = await apiCall(posturl,'GET')
        console.log(data);
        let postArr = objToarr(data);
        templating(postArr) 
     
    }
    catch(err){
        console.log(err);
    }
 }
 getPosts()



const objToarr = (resobj)=>{
    let newobjArr =[];
 for(const key in resobj)
 {
    let obj = resobj[key];
    obj.id = key;
    newobjArr.push(obj);

 }
 return newobjArr
}


const createPostCards = (post) => {
    let card = document.createElement('div');
    card.className = 'card mb-4 mt-5';
    card.id = post.id;
    card.innerHTML = `
        <div class='card-header'>
            <h1 class='m-0'>${post.title}</h1>
        </div>
        <div class="card-body">
            <p class='m-0'>${post.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onclick='onEdit(this)'>Edit</button>
            <button class="btn btn-danger" onclick='onDelete(this)'>Delete</button>
        </div>
      `
      postContainer.append(card);
  
    
}






const templating=(arr)=>{
 postContainer.innerHTML = ``
 arr.forEach(post=>{
    createPostCards(post)
 });
}



const newPost = async(eve)=>{
    eve.preventDefault();
   let newObj =
   {
     title :title.value,
     body : body.value,
     userId :userId.value
   }
    try
    {
        console.log(newObj);
        let res = await apiCall(posturl,'POST',JSON.stringify(newObj))
        newObj.id = res.name;
        createPostCards(newObj)
    }
    catch(err)
    {
        console.log(err);
    }
    finally
    {
        userForm.reset()
    }
}


const onDelete = async(ele)=>{
 let delId =ele.closest('.card').id;
 let deleteUrl = `${baseurl}/posts/${delId}.json`;
 try
 {
    let res = await apiCall(deleteUrl,'DELETE');
    document.getElementById(delId).remove();
   
 }
 catch(err)
 {
    console.log(err);
 }
}


const onEdit = async(ele)=>{
let editId = ele.closest('.card').id;
localStorage.setItem('editId',editId)
let editUrl = `${baseurl}/posts/${editId}.json`;
try{
   let data =  await apiCall(editUrl,'GET');
   title.value = data.title,
   body.value = data.body,
   userId.value = data.userId,
   sBtn.classList.add('d-none')
   uBtn.classList.remove('d-none')
} 
catch(err)
{
    console.log(err);
}
}


const onUpdate = async (ele)=>{
    let onUpdateObj =
    {
       title : title.value,
       body : body.value,
       userId : userId.value

    }
let updateId =localStorage.getItem('editId')
let updateUrl = `${baseurl}/posts/${updateId}.json`;
try
{ 
  let data =  await apiCall(updateUrl,'PATCH',JSON.stringify(onUpdateObj));
  const card = [...document.getElementById(updateId).children]
  console.log(card);
  card[0].innerHTML =` <h1 class='m-0'>${data.title}</h1>`;
  card[1].innerHTML =` <p>${data.body}</p>`;
  console.log(data);

}
catch(err)
{
    console.log(err);
}
finally
{
    userForm.reset();
    sBtn.classList.remove('d-none')
    uBtn.classList.add('d-none')

}
}


userForm.addEventListener('submit',newPost)
sBtn.addEventListener('click',onEdit)
uBtn.addEventListener('click',onUpdate)