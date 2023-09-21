export { getUserInfo }

async function getUserInfo(name) {
  const res = await fetch(`https://api.github.com/users/${name}`);
  const userInfo = await res.json();

  const html = `user: <a href="${userInfo.html_url}">${userInfo.login} </a> (id: ${userInfo.id}) 
name: ${userInfo.name}
public repos: ${userInfo.public_repos}
follows: ${userInfo.following}, is followed by ${userInfo.followers}
${userInfo.bio ? `bio: ${userInfo.bio} \n` : ''}\
${userInfo.company ? `company: ${userInfo.company}` : ''}`
    ;

  const options = { parse_mode: "HTML" }

  return [html, options]
}


