import { fn } from "./modules/utils.js";
var isSetToken = false;
// 
export var obj = {
    v: 0,
    get token() {
      return this.v;
    },
    set token(token) {
      this.v = token;
    }
  };
export let sp = {
    ocart:{},
    get objCart() {
      return this.ocart;
    },
    set objCart(t) {
        this.ocart = t;
    },
    init:(e) => {
        const token = e.t;
        return token;
    },
    fetchShipperDataV2: (e, t) => {
        let i;
        fn.api.post(e, t).done(function (e) {
            i = $.map(e.data.rows, function (e) {
                return { id: e.id, text: e.name, item: e };
            });
        });
        return i;
    },
    eClick: (e) => {
        const info = e.closest("div").querySelector(".mtc");
        info.classList.toggle("show");
    },
    refreshItemCart: (cart) => {
        if(!cart){return ""}
        let nf = new Intl.NumberFormat('en-US');
        const qty = cart.summary.sum_qty;
        let innerItem = '';

        const style = $('<style />').appendTo('head');
        style.text(`.shopping-cart::before { content: "${qty}";}`);
    
        $.each(cart.items, function(index, element) {
        const cBd = (element.fk_variance_id) ? "Bd($c6) Bdrs(4px)": ""
        innerItem += `<div class="Mt(8px) Bd($c1) Bdrs(8px) P(8px) D(f) Ai(c) Jc(sb)" id="${element.digest}">
            <div class="D(f) Ai(c) Mend(8px)">
              <img width="64" height="64" class="Bdrs(8px) Mend(8px)" src="${element.img}" alt="">
              <div class="Fz(14px)">
                <span class="D(b)" data-name id="a.${element.digest}">${element.name}</span>
                <div class="Mt(4px)">
                <span class="${cBd} Py(3px) Px(4px) Fz(12px) D(ib)">
                ${element.fk_variance_id}
                </span>
                </div> 
                <span class="D(b) Mt(8px) Fw(700)" data-subtotal id="b.${element.digest}">IDR ${nf.format(element.subtotal)}</span>
              </div>
            </div>  
            <div class="Fz(14px) wpa" style="width: 50px;">
              <span class="D(b) Ta(end) ">Qty. <span class="Fw(700)" data-qty id="c.${element.digest}">${element.quantity}</span></span>
              <a onclick="showModalEdit(this, event)" href="#" id=${element.digest} class=" Ta(end) D(b) Fw(700) C($green) Mt(20px) Td(u):h">Edit</a>
            </div>
          </div> `
        });
        const html = `
          <div class="rect"></div>
            <div class="D(f) Ai(c) Mt(16px)">
              <img class="Mend(9px)" src="/static/assets/imgs/feather-ico/shopping-cart-black.svg" alt="">
              <h5 class="Fz(21px)">Cart (${qty})</h5>
            </div>
            <div class="Mt(16px) custom-scrollbar" style="height: 35%;overflow-y: scroll;">${innerItem}</div>
            <div id='orderSummaryContainer'>
            <h6 class="Fw(700) Op(0.5) Mt(8px)">ORDER SUMMARY</h6>
            <table class="W(100%) Fz(14px) Ta(start) Bdcl(c) P-8-all">
                <thead>
                  <tr>
                      <th width="50%"></th>
                      <th width="50%"></th>
                </thead>
                <tbody class="">
                <tr id="" class="cph-1  O(n) Bd(n) Bdb($c2-b) P(4px) Ff($l)">
                    <td id="summaryQtyLbl" style="width: 50%;" class="C($black) Fw(700) Fz(15px)">Total (${cart.summary.sum_qty} Items) </td>
                    <td id="summaryPriceLbl" style="width: 50%; text-align: right;"><span class="C($black) Fw(700) Fz(15px) Mx(10px)">IDR ${nf.format(cart.summary.sum_price)}</span> 
                    </td>
                </tr>  

                  <tr id="discountSaleID" class="D(n)">
                    <td style="width: 50%;">Total</td>
                    <td style="width: 50%; text-align: right;"><span id="discount_sale"></span></td>
                  </tr>

                  <tr id="discountVoucherContainer" class="cph-1  O(n) Bd(n) Bdb($c2-b) P(4px) Ff($l) D(n)">
                    <td style="width: 50%;" class="C($green) Fw(700) Fz(15px)">Voucher</td>
                    <td style="width: 50%; text-align: right;"><span class="C($green) Fw(700) Fz(15px) Mx(10px)" id="discount_amount"> </span> 

                    <label id="voucherCodeRrow"><a href="#" onclick="sp.api.voucherRemQueue();">X</a></label> 
                    </td>
                  </tr>  
                  <tr id="totalPriceID" class=" cph-1  O(n) Bd(n) Bdb($c2-b) P(4px) Ff($l)">
                    <td style="width: 50%;" class="D(b) Fw(700)">Grand total</td>
                    <td style="width: 50%; text-align: right;"><span id="grandTotal" class="D(b) Fw(700) Mx(10px)">IDR ${nf.format(cart.summary.sum_price)}</span></td>
                  </tr>     
                </tbody>
              </table>

              <div id="voucherRow" class="">
                <div id="addVoucher" style="text-align: center; margin-top: 10px;"> 
                  <button onclick="showModalvApply(this, event);"  style="height:26px;" class="Fz(13px) W(100%) Px(26px) Bgc(t) O(n) Bd($c2) Bdrs(5px) C(#2ab57d) Cur(p) Scale(1.03):h" title="Add Voucher"><span class="Mx(10px)">%</span> Add Voucher</button>
                </div>
              </div>
              </div>
            </div>
            
            <form id="queue_form" action="/process/voucher/queue/process" method="POST">
              <input type="hidden" name="_csrf_token" id="csrf_token" value="{{ csrf_token() }}">
              <input type="hidden" name="queue_id" id="queue_id">
              <input type="hidden" name="hashid" value="{{form.my_product.hashid}}">
            </form>
 
            <a href="/checkout/shipping?token=${sp.addToCart.token}" class="Trs($c1) Ta(c) C(#ffffff) Fw(700) Cur(p) Scale(1.03):h Py(15px) Py(8px)--sm D(b) W(100%) Bdrs(7px) O(n) Bd(n) Bg($c1) Fz(14px) Mt(16px)">Buy Now</a>                                      
          <button onclick="closeModalEdit(this, event)" class="Trs($c1) C($green) Fw(700) Cur(p) Scale(1.03):h Py(15px) Py(8px)--sm D(b) W(100%) Bdrs(7px) O(n) Bgc(#ffffff) Bd($c2) Fz(14px) Mt(16px)"  >Continue Shopping</button>  
        `
        return html;
    },
    addToCart: {
        v:'FALSE',
        t:'',
        iminPrice:0,
        iqtyAv:0,
        iqtyStr:0,
        get token() {
            return this.t;
        },
        set token(t) {
            this.t = t;
        },
        get pauw() {
            return this.v;
        },
        set pauw(v) {
            this.v = v;
        },
        get minPrice() {
            return this.iminPrice;
        },
        set minPrice(minPrice) {
            this.iminPrice = minPrice;
        },
        get qtyAv() {
            return this.iqtyAv;
        },
        set qtyAv(qtyAv) {
            this.iqtyAv = qtyAv;
        },
        get qtyStr() {
            return this.iqtyStr;
        },
        set qtyStr(qtyStr) {
            this.iqtyStr = qtyStr;
        },
        step1: (e) => {
            e.preventDefault();
            const pauw = sp.addToCart.pauw;
            const minPrice = sp.addToCart.minPrice;
            const qtyStr = sp.addToCart.qtyStr;
            const token = sp.addToCart.token;
            const comb = document.getElementsByName('variance_combination')[0];
            var data = fn.serializedToJson('#form');data.prev_link = window.location.href.split("?")[0];data.variance =  comb ? comb.value : "";
            data.username = sp.addToCart.break_address(data.prev_link)[1];

            if (JSON.parse(pauw.toLowerCase())){const error = document.getElementById("error");error.style.fontSize = "12px";error.style.color = "red";if(data.bid_price==0){error.innerHTML = "Value must be greater than 0";return false;};if((data.bid_price)<parseFloat(minPrice)){error.innerHTML = "Value must be greater than or equal to " + minPrice;return false;};};
            if (qtyStr != 0){fn.api.post("/v1/api/cart/step-1", data).done(function(e){const mData = e.message_data;if(mData.RC==0){alert("You've Reached the Max Quantity Limit");} else {document.querySelector('.cart-details').innerHTML = sp.refreshItemCart(e.message_data.cart);sp.api.voucherGetQueue(e.message_data.cart);sp.objCart = e.message_data.cart;MicroModal.show('modal-1');};});};
        },
        showModal1: (e) => {
            e.preventDefault();
            const token = sp.addToCart.token;
            const data = { "token": token }
            fn.api.post("/v1/api/cart/refresh", data).done(function(e){sp.objCart = e.message_data.cart;if(e.message_data.cart){document.querySelector('.cart-details').innerHTML = sp.refreshItemCart(e.message_data.cart);sp.api.voucherGetQueue(e.message_data.cart);MicroModal.show('modal-1');}});
        },
        break_address: (url) => {
          var pathname = new URL(url).pathname;
          return pathname.split("/");
      }
    },
    address: {

        clearOption: () => {
            $("#district").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            document.getElementById("zipcode").value = "";
            $("#suburb").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            document.getElementById("zipcode").value = "";
        },
        nextstep: (e) => {
            e.preventDefault();
            var t = fn.serializedToJson("#form");
            t.prev_link = window.location.href.split("?")[0];
            t.token = obj.token;
            if ($("#form").valid()) {

                fn.api.post("/v1/api/cart/step-2", t).done(function (e) {

                    if (e["message_data"]["status"]) {
                        window.location.replace("/checkout/shipping" + e.message_data.utm_args);
                    } else {
                        alert("Whoops, looks like something went wrong");
                    }
                });
            }
        },
        init: (e) => {
            if (!isSetToken) {
                isSetToken = true;
                obj.token = e.ttys;
            }
            const TOUT = 150;
            $("[data-select]").select2({ placeholder: "Please select", allowClear: true, width: "100%" });
            $("#province").prepend($("<option selected ></option>").attr("value", e.p1.id).text(e.p1.text)).select2({ placeholder: "Please select", data: e.p, width: "100%" });

            $("#city").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            $("#city").prepend($("<option selected ></option>").attr("value", e.c1.id).text(e.c1.text)).select2({ placeholder: "Please select", data: e.c, width: "100%" });
            
            $("#district").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            $("#district").prepend($("<option selected ></option>").attr("value", e.d1.id).text(e.d1.text)).select2({ placeholder: "Please select", data: e.d, width: "100%" });

            $("#suburb").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
            $("#suburb").prepend($("<option selected ></option>").attr("value", e.s1.id).text(e.s1.text)).select2({ placeholder: "Please select", data: e.s, width: "100%" });

            $("#province").on("select2:select", function (e) {
                var t = e.params.data;
                document.getElementById('province_name').value = t.text;
                $("#city").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                sp.address.clearOption();
                setTimeout(function () {
                    $("#city")
                        .prepend($("<option selected ></option>"))
                        .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/cities-v2", { province_id: t.id }), width: "100%" });
                }, TOUT);
            });
            $("#city").on("select2:select", function (e) {
                var t = e.params.data;
                document.getElementById('city_name').value = t.text;
                $("#district").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                sp.address.clearOption();
                setTimeout(function () {
                    $("#district")
                        .prepend($("<option selected ></option>"))
                        .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/suburbs-v2", { city_id: t.id }), width: "100%" });
                }, TOUT);
            });
            $("#district").on("select2:select", function (e) {
                var t = e.params.data;
                document.getElementById('district_name').value = t.text;
                $("#suburb").html("").select2({ placeholder: "Please select", data: [], width: "100%" });
                document.getElementById("zipcode").value = "";
                setTimeout(function () {
                    $("#suburb")
                        .prepend($("<option selected ></option>"))
                        .select2({ placeholder: "Please select", data: sp.fetchShipperDataV2("/v1/api/shipper/areas-v2", { suburb_id: t.id }), width: "100%" });
                }, TOUT);
            });
            $("#suburb").on("select2:select", function (e) {
                var t = e.params.data;
                document.getElementById('suburb_name').value = t.text;
                setTimeout(function () {
                    fn.api.post("/v1/api/shipper/location-postal-v2", { postal: t.item.postcode, area_name: t.item.name }).done(function (e) {
                        document.getElementById("signature").value = typeof e.signature != "undefined" ? e.signature : "";
                        document.getElementById("zipcode").value = typeof e.postcode != "undefined" ? e.postcode : "";
                        document.getElementById("area_name").value = typeof e.area_name != "undefined" ? e.area_name : "";
                    });
                }, TOUT);
            });
            $("#form").validate({
                ignore: "",
                onblur: true,
                onkeyup: false,
                onfocusout: function (e) {
                    this.element(e);
                },
            });
            $("#name").rules("add", { required: true, messages: { required: "This Field is required." } });
            fn["int"]($('[name="phone"]'));
            $.validator.addMethod(
                "pn",
                function (e, t) {
                    if (!fn.isphone(e)) {
                        return false;
                    }
                    return true;
                },
                "Phone number is not valid."
            );
            $("#phone").rules("add", { required: true, pn: true });
            $.validator.addMethod(
                "ps",
                function (e, t) {
                    if (!$("#province :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#province").rules("add", { ps: true });
            $.validator.addMethod(
                "cs",
                function (e, t) {
                    if (!$("#city :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#city").rules("add", { cs: true });
            $.validator.addMethod(
                "ds",
                function (e, t) {
                    if (!$("#district :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#district").rules("add", { ds: true });
            $.validator.addMethod(
                "ss",
                function (e, t) {
                    if (!$("#suburb :selected").val()) {
                        return false;
                    }
                    return true;
                },
                "This Field is required."
            );
            $("#suburb").rules("add", { ss: true });
        },
    },
    shipping: {
        init:(params)=>{
            const aid   = params.aid;
            const token = params.token;
            const vhd   = params.vhd;
            const vir   = params.vir;
            const insq  = params.insq;
            const pdl   = params.pdl;
            const pahd  = params.pahd;
            const shipments = document.querySelectorAll('[data-shipment]');
            const checkoutBtn = document.querySelector('[data-checkout]');
            checkoutBtn.addEventListener('click', submitForm);
            let arrayShipments = [...shipments]
            let shipmentIndex  = null;
            let y;
            checkSm();
            function checkSm(){
              const check = arrayShipments.every(el => {
                return el.querySelector('[data-text]').textContent !== 'Select shipping methods'  
              })  
              if (check) {
                checkoutBtn.disabled = false
              } else {
                checkoutBtn.disabled = true
              }
            }
              
            shipments.forEach((shipment, index) => {
              const iss = shipments[index];
              const issD = iss.querySelector('[data-courier-detail]')
            
              shipment.addEventListener('click', (e) => {   
                if (pahd) {
                  alert('Item is not exist, please update the cart');
                  return false;
                } 
                if (pdl) {
                  alert('Product is not exist, please update the cart');
                  return false;
                } 
                if (insq) {
                  alert('Insufficient qty, please update the cart');
                  return false;
                } 
                if (vir) {
                  alert('Variant is required, please update the cart by remove the item(s)');
                  return false;
                } 
                if (vhd) {
                  alert('Variant is not exist, please update the cart by remove the item(s)');
                  return false;
                } 
                if (!aid) {
                  alert('Please set your shipping address !');
                  return false;
                } 
                let html =''
                const smCon = document.querySelector('[data-sm]') 
                var data = fn.serializedToJson("#form")
                data.token = token;
                data.id = shipment.id;
                smCon.innerHTML = '<div class="Fz(14px) loader"></div>';
                fn.api.post("/v1/api/cart/items/checkm", data).done(function(e){
            
                  const elEr = document.getElementsByClassName('errcls');
                  for(var i = 0; i < elEr.length; i++){
                    elEr[i].innerText = ""; 
                  }
                    
                   let err = e.message_data.err;
                    if (err.length > 0) {
                      err.forEach( item => {
                        document.getElementById('er.'+item.id).innerHTML = item.desc;
                      });
                      let issHtml = `
                          <div data-courier-detail class="">
                            <div  class="P(8px) Bdrs(6px) Bd($c7) D(f) Ai(c) Jc(sb)" style="background-color: #fff;"> 
                              <div class="D(f) Ai(c) Fz(14px)">
                                <div class="Bd($c7) Bdrs(4px) P(4px) D(f) Jc(c) Ai(c) Mend(8px) Ov(h)" style="width: 39px;height: 28px;">
                                  <img style="width:80%;"  src="/static/assets/imgs/physical_product/truck.svg" alt="">
                                </div>        
                                <span data-text class="">Select shipping methods</span>
                              </div>
                              <div class="Mend(12px)">
                                <div class="arrow right" style="border: solid #2AB57D;border-width: 0 2px 2px 0;padding: 2px;height: 12px;width: 12px;"></div>
                              </div>
                            </div>
                          </div>
                          `;
                      issD.innerHTML = issHtml;
                      checkoutBtn.disabled = true;
                    } else {
                
                      MicroModal.show('modal-1');
                    }
                    
                });
            
                setTimeout(function () {
                  fn.api.post("/v1/api/cart/items", data).done(function(e){
                    const courierLength = e.message_data.shipping_methods.length
                    if (!courierLength){
                      html += `<div class="Fz(11px)" style="padding-top:100px;"><p style="background-color: white;text-align: center;">No courier available. Please contact the seller for inquiry.</p></div>`
                      smCon.innerHTML = html;
                    }
                    e.message_data.shipping_methods.forEach( item => {
                      let cls = 'H(a) W(44px)';
                      let wrd = '';
                      if (item.rate_id === 96669) {
                        cls = 'W(a)';
                        wrd += `${item.name}`;
                      };
                      if (item.rate_id !== 96669) {
                        wrd += `( ${capitalizeFirstLetter(item.ltype)} - ${item.name} ) ${item.min_day} - ${item.max_day} days `;
                      };
                      html += `
                        <a data-couriers id="${item.rate_id}" href="#" class="Mt(8px) Bd($c7) Bdrs(8px) P(8px) D(f) Ai(c) Jc(sb)">
                          <div class="D(f) Ai(c) Mend(8px)">
                            <div class="Bd($c7) Bdrs(4px) D(f) Jc(c) Ai(c) Mend(8px)" style="width: 56px;height: 40px;">
                              <img class="${cls} courier-img" src="${item.logo_url}" alt="">
                            </div>
                            <div class="Fz(14px)">                
                              <span class="D(b) Op(0.5) Fw(700)" style="font-size:11px">${wrd}</span>
                            </div>
                          </div>
                          <div class="Fz(14px) wpa">
                            <span class="D(b) Fw(700)">IDR ${item.total_w_insurance}</span>
                          </div>
                        </a>`
                    });
                    smCon.innerHTML = html;
                    y = e.message_data.shipping_methods;
                  });
              
                  const toggleMenuButton = document.querySelectorAll('[data-couriers]');
                  toggleMenuButton.forEach((courier, index) => {
                    courier.addEventListener('click', () => {   
                      MicroModal.close('modal-1');   
                      const selectedCourier = y.find(obj => obj.rate_id === parseInt(courier.id))
                      const selectedElement = shipments[shipmentIndex];
                      var rateStr = selectedCourier.name + " ( IDR " + selectedCourier.total_w_insurance + " )";
            
                      setTimeout(function () {
                        var data      = fn.serializedToJson("#form");
                        data.token    = token;
                        data.id       = selectedElement.id;
                        data.rate     = courier.id;
                        data.rate_str = rateStr;
                        data.logo_url = selectedCourier.logo_url;
                        fn.api.post("/v1/api/cart/items/rates/update", data).done(function(e){
                          const msgData = e.message_data;const courierElementDetails = selectedElement.querySelector('[data-courier-detail]');
                          let html = `
                          <div data-courier-detail class="">
                            <div  class="P(8px) Bdrs(6px) Bd($c7) D(f) Ai(c) Jc(sb)" style="background-color: #fff;"> 
                              <div class="D(f) Ai(c) Fz(14px)">
                                <div class="Bd($c7) Bdrs(4px) P(4px) D(f) Jc(c) Ai(c) Mend(8px) Ov(h)" style="width: 39px;height: 28px;">
                                  <img style="${selectedCourier.rate_id === 96669 ? 'height:120%;' : 'width:90%'}"  src="${selectedCourier.logo_url}" alt="">
                                </div>        
                                <span data-text class="">${rateStr}</span>
                              </div>
                              <div class="Mend(12px)">
                                <div class="arrow right" style="border: solid #2AB57D;border-width: 0 2px 2px 0;padding: 2px;height: 12px;width: 12px;"></div>
                              </div>
                            </div>
                          </div>
                          `;
                          courierElementDetails.innerHTML = html;
                          let nf = new Intl.NumberFormat('en-US');let totalSRate = msgData.total_shipping_rate;let totalSRateStr = msgData.total_shipping_rate_str;let coBtnDisabled = msgData.co_btn_disabled;checkoutBtn.disabled = coBtnDisabled;let selectedCourierInt = selectedCourier.total_w_insurance.replace(/[^0-9]/g,'');
                          let grandTotal =  parseInt(totalSRate) + parseInt(document.getElementById("subtotal").innerText.replace(/[^0-9]/g,'')) - parseInt(document.getElementById("discount_amount").innerText.replace(/[^0-9]/g,''));
                          grandTotal = (grandTotal>0) ? grandTotal : 0
                          document.getElementById('shipping_fee').innerHTML = "IDR " + totalSRateStr;
                          document.getElementById('grandTotal').innerHTML = "IDR " +  nf.format(grandTotal);
                        });
                      }, 5);
            
                      checkSm();
            
                    });
                  });
                  shipmentIndex = index;
                }, 50);
            
            
              });
            });
            
            function capitalizeFirstLetter(string){return string.charAt(0).toUpperCase() + string.slice(1);}
            function submitForm(){sp.shipping.validateForm();}
        },
        validateForm: (e) => {
            var f = fn.serializedToJson("#form");
            fn.api.post("/v1/api/cart/items/check", f).done(function (e) {
              if(e.message_data.pubAflHasDeleted) {
                alert('Item is not exists, please update the cart by remove the item(s)');
                location.reload();
                return;
              }
              if(e.message_data.variantIsRequired) {
                alert('Variant is required, please update the cart by remove the item(s)');
                location.reload();
                return;
              }
              if (e.message_data.dataHasChanged) {
                alert("Item Price or Dimension has changed.");
                location.reload();
              } else {
                const chg = e["message_data"]["changes"]
                if (chg == 2) {
                    alert("Whoops, looks like something went wrong");
                } else {
                    $("#form").attr("action", "/process/v2/checkout");
                    $('#form').submit();
                }
              }
            });
        }
    },
    cart: {
        updateQty: (e) => {
            const nameInput = document.querySelector('[data-name]')
            const subtotalInput = document.querySelector('[data-subtotal]')
            const qtyInput = document.querySelector('[data-qty]')
            var f = fn.serializedToJson("#Form1");
            f.token = tif;
            fn.api.post("/v1/api/cart/items/quantity/update", f).done((e) => {
              const mData = e.message_data;
              if(mData.RC==0){
                alert("You've Reached the Max Quantity Limit");MicroModal.close('modal-2');MicroModal.show('modal-1');
              }else{
                let nf = new Intl.NumberFormat('en-US');
                const data = e.message_data.item;
                const cart = e.message_data.cart;
                sp.objCart = cart;
                const summary = e.message_data.cart.summary;
                document.getElementById('a.'+tif).innerHTML = data.name;
                document.getElementById('b.'+tif).innerHTML = "IDR " + data.subtotal;
                document.getElementById('c.'+tif).innerHTML = data.quantity;

                document.getElementById('cqty').innerHTML = 'Cart (' + summary.sum_qty + ')';


                const discAmountLbl = document.querySelector('#discount_amount')
                const queueIdInput = document.querySelector('#queue_id')


                const summaryQtyLbl = document.querySelector('#summaryQtyLbl')
                const summaryPriceLbl = document.querySelector('#summaryPriceLbl')
                const grandTotalLbl = document.querySelector('#grandTotal')


                summaryQtyLbl.innerHTML =  "Total (" + summary.sum_qty + " Items)";
                summaryPriceLbl.innerHTML = "IDR " + nf.format(summary.sum_price)

                sp.api.voucherRemQueue();

                MicroModal.close('modal-2');
                MicroModal.show('modal-1');
 
                const qty = cart.summary.sum_qty

                const style = $('<style />').appendTo('head');
                style.text(`.shopping-cart::before { content: "${qty}";}`);
              };

            });
            e.preventDefault();
        },
        delItem: (e) => {
            e.preventDefault();
            var f = fn.serializedToJson("#Form1");
            f.token = tif;
            fn.api.post("/v1/api/cart/items/delete", f).done((e) => {
                const cart = e.message_data.cart;
                const data = e.message_data.item;
                sp.objCart = cart;
                sp.api.voucherRemQueue();
                document.getElementById(tif).remove();

                MicroModal.close('modal-2');
                if (cart) {
                  MicroModal.show('modal-1');
                } else {
                  const style = $('<style />').appendTo('head');
                  style.text(`.shopping-cart::before { content: "0";}`);
                }
                

            });

        },
        delItem1:(e)=>{e.preventDefault();fn.api.post("/v1/api/cart/items/delete", {token:tif}).done((e) => {const cart = e.message_data.cart;const data = e.message_data.item;sp.objCart = cart;});}
    },
    methods: {
        nextstep: (e) => {
           // deprecated
            e.preventDefault();
            var t = $("input[name=shipping_method]:checked");
            var i = fn.serializedToJson("#form");
            i.prev_link = window.location.href.split("?")[0];
            i.signature = t.val();
            i.rate_id = t.attr("id");
            if (t.length) {
                fn.api.post("/v1/api/cart/checkout", i).done(function (e) {
                    let pricing = e.message_data.pricing;
                    if (pricing.status == "fail") {
                        alert(pricing.data.content);
                    } else {
                        window.location.replace(e["message_data"]["checkout_link"] + window.location.search);
                    }
                });
            }
        },
        init: (e) => {},
    },
    orders: {
        changeToProcess: (t, e) => {
            var f = fn.serializedToJson("#awForm");
            f.uuid = t.id;
            f.status = 1;
            fn.api.post("/v1/api/transactions/change-status", f).done((e) => {
              setTimeout(()=>{
                window.location.reload(true);
              });
            });
        },
        changeToComplete: (t, e) => {
            var f = fn.serializedToJson("#awForm");
            f.uuid = t.id;
            f.status = 4;
            fn.api.post("/v1/api/transactions/change-status", f).done((e) => {
              setTimeout(()=>{
                window.location.reload(true);
              });
            });
        },
        openModal: (t, e) => {
            document.getElementById("airway_bill").value = "";
            MicroModal.show("modalAlert");
            $("#modalAlert").data("argument", { id: t.id });
        },
        data: (e) => {
            return e;
        },
    },
    api: {
        updateAwBill: (t, e) => {
            e.preventDefault();
            var args = $("#modalAlert").data("argument");
            var t = fn.serializedToJson("#awForm");
            t.uuid = args.id;
            if ($("#awForm").valid()) {
                fn.api.post("/v1/api/transactions/update", t).done((e) => {
                    if (!e.status) {
                        alert(args.id + " NOT FOUND");
                    }
                    MicroModal.close("modalAlert");
                    setTimeout(()=>{
                      window.location.reload(true);
                    });
                });
            }
        },
        voucherGetQueue:(cart) => {          

          fn.api.post("/v1/api/cart/voucher-queue/get", { "queue_id": cart.voucher_queue_id, "tif" : sp.addToCart.token}).done((e) => {
            const discountVoucherContainer = document.querySelector('#discountVoucherContainer')
            const voucherRow = document.querySelector('#voucherRow')
            
            let nf = new Intl.NumberFormat('en-US');
            const messageAction = e.message_action
            const messageData = e.message_data
            const messageDesc = e.message_desc

            if (messageAction == 'GET_QUEUE_SUCCESS') {

              const discAmountLbl = document.querySelector('#discount_amount')
              const queueIdInput = document.querySelector('#queue_id')
              queueIdInput.value = cart.voucher_queue_id;

              const grandTotalLbl = document.querySelector('#grandTotal')
              let grandTotal = cart.summary.sum_price -  messageData.discount_amount
              grandTotal = (parseFloat(grandTotal)>0) ? nf.format(grandTotal):0;
              discountVoucherContainer.classList.remove("D(n)");
              voucherRow.classList.add("D(n)");

              discAmountLbl.innerHTML = "IDR -" + nf.format(messageData.discount_amount)
              grandTotalLbl.innerHTML = "IDR " + grandTotal
            }
          });

        },
        voucherAddQueue:() => {
          const voucher_code = $('#voucher_code').val();
          const payload = {
              "tif" : sp.addToCart.token,
              "voucher_code" : voucher_code
          }
          fn.api.post("/v1/api/cart/voucher-queue", payload).done((e) => {
              const discountVoucherContainer = document.querySelector('#discountVoucherContainer')
              const voucherRow = document.querySelector('#voucherRow')
              
              let nf = new Intl.NumberFormat('en-US');
              const messageAction = e.message_action
              const messageData = e.message_data
              const messageDesc = e.message_desc
              if (messageAction != 'ADD_QUEUE_SUCCESS') {
                const vcrMsg = document.querySelector('#vcr_msg')
                vcrMsg.innerHTML = messageData.status
              } else {
                const discAmountLbl = document.querySelector('#discount_amount')
                const queueIdInput = document.querySelector('#queue_id')
                queueIdInput.value = messageData.queue_id;
                const cart = messageData.cart
                const grandTotalLbl = document.querySelector('#grandTotal')
                let grandTotal = cart.summary.sum_price -  messageData.discount_amount

                discountVoucherContainer.classList.remove("D(n)");
                voucherRow.classList.add("D(n)");
                grandTotal = (parseFloat(grandTotal)>0) ? nf.format(grandTotal):0;
                discAmountLbl.innerHTML = "IDR -" + nf.format(messageData.discount_amount)
                grandTotalLbl.innerHTML = "IDR " + grandTotal

                MicroModal.show("modal-1");
                MicroModal.close("modal-7");
              }
              
          });
        },
        voucherRemQueue:() => {
          let nf = new Intl.NumberFormat('en-US');
          const queueId = $("#queue_id").val();

          const discountVoucherContainer = document.querySelector('#discountVoucherContainer')
          const voucherRow = document.querySelector('#voucherRow')
          const summaryQtyLbl = document.querySelector('#summaryQtyLbl')
          const summaryPriceLbl = document.querySelector('#summaryPriceLbl')
          const discAmountLbl = document.querySelector('#discount_amount');
          const grandTotalLbl = document.querySelector('#grandTotal')
          const orderSummaryContainer = document.querySelector('#orderSummaryContainer')
          const cart = sp.objCart;
          if (cart) {
            fn.api.post("/process/voucher/remove_queue", {"queue_id" : queueId}).done((e) => {
              const messageAction = e.message_action
              summaryQtyLbl.innerHTML =  "Total (" + cart.summary.sum_qty + " Items)";
              summaryPriceLbl.innerHTML = "IDR " + nf.format(cart.summary.sum_price)
              discountVoucherContainer.classList.add("D(n)");
              voucherRow.classList.remove("D(n)");
              discAmountLbl.innerHTML = "IDR -0"
              grandTotalLbl.innerHTML = "IDR " + nf.format(cart.summary.sum_price)
            });
        } else {
          orderSummaryContainer.classList.add("D(n)");
        }
        }

    },
};
window.sp = sp;
