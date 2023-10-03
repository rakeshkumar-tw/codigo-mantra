const saveBtns = document.querySelectorAll('.save');
const voteBts = document.querySelectorAll('.vote');
const searchBtn = document.querySelector('.search');
const inputSearch = document.querySelector('.input-search');
const deleteBtns = document.querySelectorAll('.delete');
const commentBtn = document.getElementById('add-comment');
const noComment = document.getElementById('no-comment');
const comments = document.querySelector('.all-comments');
const commentCounts = document.getElementById('comment-count');
let current = new Date();
let PostId;
let sendBlogBtn=document.querySelectorAll(".blog-post")
let BtnId= document.querySelectorAll(".SendBtn")
let close_form= document.querySelector(".close")
const emailFormModal = document.getElementById('emailFormModal');
const emailForm = document.getElementById('emailForm');
const emailButton = document.getElementById('emailButton');

let cDate =
  current.getFullYear() +
  '-' +
  (current.getMonth() + 1) +
  '-' +
  current.getDate();
let cTime =
  current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds();
// let dateTime1 = cDate + ' ' + cTime;
var dateTime = current.toLocaleString([], {
  hour: '2-digit',
  minute: '2-digit',
});
// to save Article
saveBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const url = `save/${btn.id}`;
    fetch(url, {
      method: 'post',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'removed') {
          btn.classList.remove('saved');
          btn.querySelector('.save-txt').innerHTML = 'Save';
          showMessage('Article Removed from Bookmarks');
        } else {
          btn.classList.add('saved');
          btn.querySelector('.save-txt').innerHTML = 'Saved';
          showMessage('Article saved in Bookmarks');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
});
// end Save Article

// start vote
voteBts.forEach((btn) => {
  btn.addEventListener('click', () => {
    fetch(`vote/${btn.dataset.vote}`, {
      method: 'put',
    })
      .then((res) => res.json())
      .then((data) => {
        let votedTxt = btn.querySelector('.vote-num');
        if (data.messege == 'downvote') {
          btn.classList.remove('voted');
          votedTxt.innerHTML = data.count;
        } else {
          btn.classList.add('voted');
          votedTxt.innerHTML = data.count;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
});
// end Vote

// Start delete
deleteBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const parent = document.querySelector(
      `article[data-card="${btn.dataset.delete}"]`
    );
    swal({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this article file!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const url = `delete/${btn.dataset.delete}`;
        fetch(url, {
          method: 'post',
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.message === 'deleted') {
              swal('Poof! Your article file has been deleted!', {
                icon: 'success',
              }).then(() => parent.remove());
            } else {
              swal('Try again..', {
                icon: 'error',
              });
            }
          })
          .catch((e) => {
            swal('Try again..', {
              icon: 'error',
            });
          });
      } else {
        swal('Your article file is safe!');
      }
    });
  });
});

// Start Comment
commentBtn&&commentBtn.addEventListener('click', (e) => {
  // e.preventDefault();
  
 
  const commentContent = document.getElementById('comment-content');
  if (noComment) {
    noComment.remove();
  }
  if (commentContent.value !== '') {
    fetch(`comment/${commentBtn.dataset.comment}`, {
      method: 'post',
      body: JSON.stringify({
        comment: commentContent.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const prettyData = data;
        comments.innerHTML =
          createComment(prettyData.content, dateTime, prettyData.owner) +
          comments.innerHTML;
        commentCounts.innerHTML = prettyData.numbComments;
        showMessage('Comment Added Successfully');
        if(document.querySelector("#comment-content").value!=""){
          window.location.reload()
      
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // commentContent.value = '';
});

function createComment(content, created, owner) {
  return `
      <div class="one-comment">
        <div class="header-comment">
          <small style="color: var(--bs-cyan);">Published by ${owner } at ${ created }</small>
          <small style="color: var(--bs-cyan);">${cDate}, ${created}</small>
          
        </div>
        <div class="content">
          <p>${content}</p>
        </div>
      </div>
  `;
}

// for message
function showMessage(message) {
  const x = document.getElementById('snackbar');
  x.className = 'show';
  x.innerHTML = message;
  setTimeout(function () {
    x.className = x.className.replace('show', '');
  }, 3000);
}

// Send blog from js code

sendBlogBtn.forEach((i,index)=>{
  i.addEventListener("click",()=>{
    emailFormModal.setAttribute("style","display:block")
    PostId=BtnId[index].value
  })
})

if(close_form!=null){
  close_form.addEventListener("click",()=>{
  emailFormModal.setAttribute("style","display:none")
  })
}


// emailForm.js
document.addEventListener("DOMContentLoaded", function() {

if(emailButton!=null){
  emailButton.addEventListener('click', () => {
      emailFormModal.style.display = 'block';
  });
}

if(emailButton!=null){
  emailForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    // const postId = document.getElementById('postId').value;
    console.log(PostId)
    fetch(`/send_email/${PostId}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')  // Function to get CSRF token from cookies
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Email sent successfully!');
            emailFormModal.style.display = 'none';
        } else {
            alert('Failed to send email. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
}

  // Function to get CSRF token from cookies
  function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
});


// Like and unlike comment

document.querySelectorAll('.like-button').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.like-button')
      const commentId = this.getAttribute('data-comment-id');
      const likeCountElement = this.nextElementSibling; // Element displaying like count

      // Send AJAX request to like a comment
      fetch(`/like-comment/${commentId}/`, {
          method: 'POST',
          headers: {
              'X-CSRFToken': csrf_token,  // Don't forget to include CSRF token
              'Content-Type': 'application/json'
          },
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              // Update the like count in the UI
         if(button.innerHTML=="Unlike"){
          button.innerHTML="like"
         }
         else{
          button.innerHTML="Unlike"
         }
              likeCountElement.textContent = data.likes;
          } else {
              console.error('Failed to like the comment.');
          }
      })
      .catch(error => {
          console.error('Error occurred:', error);
      });
  });
});
