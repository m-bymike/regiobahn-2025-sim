<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
#app {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #999999;

    &.router-link-exact-active {
      color: #e2002a;
    }
  }
}
</style>
