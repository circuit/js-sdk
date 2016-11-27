(function(window){
    // 'use strict';

    function template() {
        let _self = {};
        let _client;

        let client_ids = {
            'circuitsandbox.net': 'ea9ccdf487b94a208f7ae31f3a201710',
            'beta.circuit.com': '11111111111111111111111111111111',
            'circuitdev.unify.com:8094': '8e04fc659d9148ca9ddaff1e68a1d662'
        };
        let domains = Object.keys(client_ids);

        function getParameterByName(name, url) {
            if (!url) {
              url = window.location.href;
            }
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        _self.init = (client, el, o) => {
            _client = client;

            o.fork = o.fork || `Fork your own bin using the 'Edit' option on the top right of the page.`;

            let title = document.createElement('h3');
            title.textContent = o.title;
            el.appendChild(title);
            
            let summary = document.createElement('div');
            let description = document.createElement('div');
            description.textContent = o.description;
            summary.appendChild(description);
            let fork = document.createElement('div');
            fork.textContent = o.fork;
            summary.appendChild(fork);
            el.appendChild(summary);
            
            let apis = document.createElement('h4');
            apis.textContent = 'APIs used:';
            el.appendChild(apis);

            let apiMethods = document.createElement('ul');
            el.appendChild(apiMethods);
            o.apiMethods.sort().forEach(m => {
                let a = document.createElement('a');
                a.appendChild(document.createTextNode(m));
                a.href = `https://circuitsandbox.net/sdk/classes/Client.html#method_${m}`;
                a.target = '_blank';
                let li = document.createElement('li');
                li.appendChild(a);
                apiMethods.appendChild(li);
            });
            
            let prerequisites = document.createElement('h4');
            prerequisites.textContent = 'Prerequisites:';
            el.appendChild(prerequisites);
            
            let prereqList = document.createElement('ul');
            el.appendChild(prereqList);
            o.prerequisites.sort().forEach(m => {
                let li = document.createElement('li');
                li.appendChild(document.createTextNode(m));
                prereqList.appendChild(li);
            });

            let loggedOutSection = document.createElement('section');

            let domain = document.createElement('select');
            domain.id = 'domainsel';
            for (var i = 0; i < domains.length; i++) {
                var option = document.createElement('option');
                option.text = domains[i];
                option.value = encodeURIComponent(domains[i]);
                domain.appendChild(option);
            }
            loggedOutSection.appendChild(domain);
            let logonButton = document.createElement('button');
            logonButton.innerHTML = 'Logon';
            loggedOutSection.appendChild(logonButton);
            let connectionState1 = document.createTextNode('(Disconnected)');
            loggedOutSection.appendChild(connectionState1);
            el.appendChild(loggedOutSection);

            let loggedInSection = document.createElement('section');
            let logoutButton = document.createElement('button');
            logoutButton.innerHTML = 'Logout';
            loggedInSection.appendChild(logoutButton);
            let connectionState2 = document.createTextNode('Connected');
            loggedInSection.appendChild(connectionState2);
            el.appendChild(loggedInSection);

            // Reload page when changing the domain
            domain.addEventListener('change', () => {
                location.href = location.origin + location.pathname + '?domain=' + domain.value;
            });
            let currDomain = getParameterByName('domain');
            currDomain && (document.querySelector('#domainsel [value="' + encodeURIComponent(currDomain) + '"]').selected = true);

            // Add print container
            let result = document.createElement('pre');
            document.body.appendChild(result);

            // Helper to print output
            function print(s) {
              if (s.message && (s.code || s.stack)) {
                result.innerHTML += `<span style="color:red">${s}<br></span>`;
                console.error(s);
              } else {
                s = s.message || s;
                result.innerHTML += `<span>${s}<br></span>`;
              }
            }

            _client.addEventListener('connectionStateChanged', evt => {
                print(`Received connectionStateChanged event. state: ${evt.state}`);
                connectionState1.textContent = connectionState2.textContent = `(${evt.state})`;
                let connected = (evt.state === Circuit.Enums.ConnectionState.Connected);
                loggedOutSection.style.display = connected ? 'none' : '';
                loggedInSection.style.display = !connected ? 'none' : '';
                document.getElementById('main').style.display = !connected ? 'none' : '';
            });

            loggedInSection.style.display = 'none';

            console.log('Circuit JSBin template initialized');

            return {
                logonButton: logonButton,
                logoutButton: logoutButton,
                print: print,
                result: result
            }
        };

        Object.defineProperty(_self, 'domain', {
            get: function () { return getParameterByName('domain') || 'circuitsandbox.net'; },
            enumerable: true,
            configurable: false
        });

        Object.defineProperty(_self, 'client_id', {
            get: function () { return client_ids[_self.domain]; },
            enumerable: true,
            configurable: false
        });

        return _self;
    }

    if (typeof window.jsBinTpl === 'undefined'){
        window.jsBinTpl = template();
    }
})(window);
