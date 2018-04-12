<template>

<div class="landing">
<section id="header">
				<div class="inner" style="height:741px;">
						<img class="logo" src="../../../static/images/animated_logo.gif" style="height:173px; width:258px; margin-top:50px; margin-bottom:50px;">
				<div>Sei un homebrewer e cerchi un software per le tue ricette?</div>
				<div>HomebrewLab è la soluzione: condensa anni di esperienza di</div>
				<div>produzione artigianale in una flessibilità mai vista prima.</div>

		<a style="margin-top:50px;" href="#one" class="button scrolly">Esplora</a>
		<a id="btn-login" style="margin-top:50px;" href="#" class="button scrolly" @click="handleLogin()">Registrati/Entra</a>
		</div>
	</section>

	<section id="one" class="main style1">
		<div class="container">
			<div class="row 150%">
				<div class="6u 12u$(medium)">
					<header class="major">
						<h2 style="color:#FEA81F">Set up your equipment<br />
						and get ready to create</h2>
					</header>
					<p>You can choose between our deafult models or create your own, in order to perfectly recreate your setup and get started with HomeBrewLab</p>
				</div>
				<div class="6u$ 12u$(medium) important(medium)">
					<span class="image fit"><img src="../../../static/images/pic01.jpg" alt="" /></span>
				</div>
			</div>
		</div>
	</section>

	<section id="two" class="main style2">
		<div class="container">
			<div class="row 150%">
				<div class="6u$ 12u$(medium)">
					<header class="major">
						<h2 style="color:#FEA81F">Hundreds of ingredients...<br />
						and counting!</h2>
					</header>
					<p>Check out our selection of every product you need for creating the perfect craft beer. We have hundreds of user-submitted hops, malts, yeasts, and much much more!</p>
					<p>Moreover, you can add your personal ingredients in order to match all your necessities... <br/>
          Blandit faucibus proin. Ac aliquam integer adipiscing enim non praesent vis commodo nunc phasellus cubilia ac risus accumsan. Accumsan blandit. Lobortis phasellus non lobortis dit varius mi varius accumsan lobortis. Blandit ante aliquam lacinia lorem lobortis semper morbi col faucibus vitae integer placerat accumsan orci eu mi odio tempus adipiscing adipiscing adipiscing curae consequat feugiat etiam dolore.</p>
					<p>Adipiscing a commodo ante nunc accumsan interdum mi ante adipiscing. A nunc lobortis non nisl amet vis volutpat aclacus nascetur ac non. Lorem curae eu ante amet sapien in tempus ac. Adipiscing id accumsan adipiscing ipsum.</p>
				</div>
			</div>
		</div>
	</section>

	<section id="three" class="main style1 special">
		<div class="container">
			<header class="major">
				<h2 style="color:#FEA81F">It's now time to create!</h2>
			</header>
			<p>Once you have set your equipment and ingredients, choose a recipe or create your own</p>
			<div class="row 150%">
				<div class="4u 12u$(medium)">
					<span class="image fit"><img src="../../../static/images/pic02.jpg" alt="" /></span>
					<h3>Magna feugiat lorem</h3>
					<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat et nascetur.</p>
					<ul class="actions">
					</ul>
				</div>
				<div class="4u 12u$(medium)">
					<span class="image fit"><img src="../../../static/images/pic03.jpg" alt="" /></span>
					<h3>Magna feugiat lorem</h3>
					<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat et nascetur.</p>
					<ul class="actions">
					</ul>
				</div>
				<div class="4u$ 12u$(medium)">
					<span class="image fit"><img src="../../../static/images/pic04.jpg" alt="" /></span>
					<h3>Magna feugiat lorem</h3>
					<p>Adipiscing a commodo ante nunc magna lorem et interdum mi ante nunc lobortis non amet vis sed volutpat et nascetur.</p>
					<ul class="actions">
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section id="four" class="main style2 special">
		<div class="container">
			<header class="major">
				<h2 style="color:#FEA81F">Abbiamo stimolato la tua curiosità?</h2>
			</header>
			<p>Registrati anche tu e migliora le tue birre. E' gratis!</p>
			<ul class="actions uniform">
				<button  type="submit" id="btn-login1" style="font-family:'Montserrat';">Registrati</button>
			</ul>
		</div>
	</section>
</div>
</template>

<script src="../../../dist/static/js/jquery.min.js"></script>
<script src="../../../dist/static/js/jquery.scrolly.min.js"></script>
<script src="../../../dist/static/js/skel.min.js"></script>
<script src="../../../dist/static/js/util.js"></script>
<script src="../../../dist/static/js/main.js"></script>

<script type="text/javascript">
	import { isLoggedIn, login, logout, setIdToken, setAccessToken } from '../../assets/auth';

	export default {
		name: 'Landing',
		methods: {
			handleLogin: function() {
        	  login();
    		},
		    handleLogout: function() {
		      logout();
		    },
		    isLoggedIn: function() {
		      return isLoggedIn();
		    }
		}
	}
</script>
