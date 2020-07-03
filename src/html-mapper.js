;(function(){
   function getRefs(root) {
      var refs = {}
      for (var el of Array.from(root.querySelectorAll("[_]"))) {
      el.getAttribute("_").split(";").reduce((acc, val) => {
         var vv = val.split("|")
         var data = {targets: vv[1] ? vv[1].split(",") : [], el}
         if (acc[vv[0]]) {
            acc[vv[0]].push(data)
         } else {
            acc[vv[0]] = [data]
         }
         return acc
      }, refs)
      }
      return refs
   }

   var map = new WeakMap()
   function compile(root) {
      if (map.has(root)) {
         return map[root]
      } else {
         return map.set(root, getRefs(root)).get(root)
      }
   }

   function update(root, data) {
      var v = map.get(root)
      if (!v) v = compile(root)
      for (var key of Object.keys(data)) {
         for (var content of v[key] || []) {
            var el = content.el
            content.targets.forEach(x => {
               if (x === "text") {
                  el.textContent = data[key]
               } else {
                  if (data[key] === null || data[key] === undefined) el.removeAttribute(x)
                  else el.setAttribute(x, data[key])
               }
            })
         }
      }
      return v
   }

   window.skinnyMap = {compile, update}
}());
