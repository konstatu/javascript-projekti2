	window.onload = function(){

	//Lisää eöementit muuttujiin
	var etsiMaa = document.getElementById("painike");
	var syötäMaa = document.getElementById("input");
	var näytäMaa = document.getElementById("maa");
	var näytäTartuntaMäärä = document.getElementById("kaikkiCovidTartunnat");
	var varoitus = document.getElementById("tarkistusPyyntö");
	var maaKoodi = document.getElementById("maaKoodi");
	var tartunnatKuukaudessa = document.getElementById("covidTartunnat");

	// piilottaa div-elementtien tiedot
	document.getElementById("tiedot").style.display = "none";
	//Piiloittaa myöskin kuukausitaulukot
	tartunnatKuukaudessa.style.display = "none";

	//Lisää tapahtumakuuntelijan painikkeeseen.
	etsiMaa.addEventListener("click", function() {

	//Tallentaa merkkijonon muuttujaan
		var maanValinta = syötäMaa.value ;
		varoitus.innerHTML = "";
		syötäMaa.value = "";

		// hankitaan muuttujien kautta päivämäärä
		var päivä = new Date();
		var päivämäärä = päivä.getDate();
		// lisätään 1, koska getMonth alkaa nollasta.
		var kuukausi = päivä.getMonth() + 1;
		var vuosi = päivä.getFullYear();

		// Check if searchbar is empty
		if(maanValinta === "" || maanValinta === " "){
			varoitus.innerHTML = "Tarkista oikein kirjoitus, maa tulee olla kirjoitettuna kokonaan englanniksi!";
			document.getElementById("tiedot").style.display = "none";

		//Tarkistetaan onko syötettyä maata olmassa
		}else{
		// Tehdään syötteen mukainen kysely.
			näytäMaa.innerHTML = maanValinta;
			var xmlhttp = new XMLHttpRequest();

		//tehdään haku
			xmlhttp.open("GET", "https://api.covid19api.com/total/country/" + maanValinta.toLowerCase() + "/status/confirmed?from=2020-01-01T00:00:00Z&to="+ vuosi + "-" + kuukausi + "-" + päivämäärä + "T00:00:00Z", true);
			xmlhttp.send();

			xmlhttp.onreadystatechange=function() {
				if(xmlhttp.readyState==4 && xmlhttp.status==200){
					//tallennetaan saadut tiedot muuttujaan
					var data = xmlhttp.responseText;
					//parsitaan haettu data
					var parsedData = JSON.parse(data) ;
					
					//Lisätään sivuston loppuun teksti, jolloin tieto on haettu.
					document.getElementById("tietojenTarkistus").innerHTML = "Tiedot tarkistettu " + päivämäärä + "/" + kuukausi + "/" + vuosi;

					
					//haetaan corona-tapaustenmäärä.
					var kokonaisMäärä = parsedData[parsedData.length -1].Cases
					näytäTartuntaMäärä.innerHTML = "Tapauksia yhteensä: " + kokonaisMäärä;
					//Jos kokonaismäärä tartunnoissa on yli 100 000,
					//niin tapauksia teksti muuttuu punaiseksi
					if ( kokonaisMäärä > 100000 ) {
						document.getElementById("kaikkiCovidTartunnat").style.color = "red";
					}
					// etsii jokaisen kuukauden tartuntatiedon
					// tallentaa taulukon pituuden muuttujaan
					var tablelength = parsedData.length;

					// TODO - Figure out why it shows the tapaukset one month off
					for ( var i = 0; i < tablelength; i++){
						// date on taulukossa stringinä.
						//Käytän tässä tapauksessa subsstringiä, jotta saan haettua indeksit 5 ja 6.

						// Tammikuu on viimeinen indeksi eli 01.
						if (parsedData[i].Date.substring(5 ,7) === "01"){
						//Lisätään tammikuun tartuntamäärä. Jos on kuukaudessa yli 1000
						//tartuntaa, niin silloin lukema muuttuu punaiseksi.
							var covidTammikuu = parsedData[i].Cases ;
							document.getElementById("TapauksetTammikuu").innerHTML = covidTammikuu;
								if ( covidTammikuu > 1000 ) {
								document.getElementById("TapauksetTammikuu").style.color = "red"; }
						}
						// Lisätään helmikuun tartuntamäärä, joka lasketaan vähentämällä kokonaistartuntamäärästä
						// tammikuun tartuntamäärä.
						//Jos on kuukaudessa yli 1000
						//tartuntaa, niin silloin lukema muuttuu punaiseksi.
						if (parsedData[i].Date.substring(5 ,7) === "02"){

							var covidHelmikuu = parsedData[i].Cases ;
							document.getElementById("TapauksetHelmikuu").innerHTML = covidHelmikuu - covidTammikuu;
								if ( covidHelmikuu - covidTammikuu > 1000 ) {
								document.getElementById("TapauksetHelmikuu").style.color = "red"; }
						}
						
						// SAMA KAAVA KUIN EDELLISESSÄ.TÄTÄ SAMAA KAAVAA KÄYTTÄMÄLLÄ
						// SAADAAN LASKETTUA JOKA KUUKAUDELLE TARTUNTAMÄÄRÄ
						if (parsedData[i].Date.substring(5 ,7) === "03"){

							var covidMaaliskuu = parsedData[i].Cases;
							document.getElementById("TapauksetMaaliskuu").innerHTML = covidMaaliskuu - covidHelmikuu;
								if ( covidMaaliskuu - covidHelmikuu > 1000 ) {
								document.getElementById("TapauksetMaaliskuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "04"){

							var covidHuhtikuu = parsedData[i].Cases;
							document.getElementById("TapauksetHuhtikuu").innerHTML = covidHuhtikuu - covidMaaliskuu;
								if ( covidHuhtikuu - covidMaaliskuu > 1000 ) {
								document.getElementById("TapauksetHuhtikuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "05"){

							var covidToukokuu = parsedData[i].Cases;
							document.getElementById("TapauksetToukokuu").innerHTML = covidToukokuu - covidHuhtikuu;
								if ( covidToukokuu - covidHuhtikuu > 1000 ) {
								document.getElementById("TapauksetToukokuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "06"){

							var covidKesäkuu = parsedData[i].Cases;
							document.getElementById("TapauksetKesäkuu").innerHTML = covidKesäkuu - covidToukokuu;
								if ( covidKesäkuu - covidToukokuu > 1000 ) {
								document.getElementById("TapauksetKesäkuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "07"){

							var covidHeinäkuu = parsedData[i].Cases;
							document.getElementById("TapauksetHeinäkuu").innerHTML = covidHeinäkuu - covidKesäkuu;
								if ( covidHeinäkuu - covidKesäkuu > 1000 ) {
								document.getElementById("TapauksetHeinäkuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "08"){

							var covidElokuu = parsedData[i].Cases;
							document.getElementById("TapauksetElokuu").innerHTML = covidElokuu - covidHeinäkuu;
								if ( covidElokuu - covidHeinäkuu > 1000 ) {
								document.getElementById("TapauksetElokuu").style.color = "red"; }
					   }
						if (parsedData[i].Date.substring(5 ,7) === "09"){

							var covidSyyskuu = parsedData[i].Cases;
							document.getElementById("TapauksetSyyskuu").innerHTML = covidSyyskuu - covidElokuu;
								if ( covidSyyskuu - covidElokuu > 1000 ) {
								document.getElementById("TapauksetSyyskuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "10"){

							var covidLokakuu = parsedData[i].Cases;
							document.getElementById("TapauksetLokakuu").innerHTML = covidLokakuu - covidSyyskuu;
								if ( covidLokakuu - covidSyyskuu > 1000 ) {
								document.getElementById("TapauksetLokakuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "11"){

							var covidMarraskuu = parsedData[i].Cases;
							document.getElementById("TapauksetMarraskuu").innerHTML = covidMarraskuu - covidLokakuu;
								if ( covidMarraskuu - covidLokakuu > 1000 ) {
								document.getElementById("TapauksetMarraskuu").style.color = "red"; }
						}
						if (parsedData[i].Date.substring(5 ,7) === "12"){

							var covidJoulukuu = parsedData[i].Cases;
							document.getElementById("TapauksetJoulukuu").innerHTML = covidJoulukuu - covidMarraskuu;
								if ( covidJoulukuu - covidMarraskuu > 1000 ) {
								document.getElementById("TapauksetJoulukuu").style.color = "red"; }

						}


					}
					



				}
			}
			// Vaihtaa blokin asetuksen näkyväksi
			// div-taulukko tulee näkyviin
			document.getElementById("tiedot").style.display = "block";
			 tartunnatKuukaudessa.style.display = "block";
		}
	});
	}