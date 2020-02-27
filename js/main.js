// 先把数据中前三条依次插入到四列中，接下来再拿出四条数据按照当前四列高矮排序，哪列最矮先给哪个插入内容
$(function () {
    let page = 0,
	     imgDate = null,
        running = false;
    //获取数据
    let queryDate = ()=>{
        page++;
        $.ajax({
            url:  './json/data.json?page=${page}',
            method: 'get',
            async: false,
            dataType: 'json',
            success: (result)=>{
            	imgDate = result;
            }
         })
    };
    queryDate();

    //绑定数据一
// 	let queryHTML = ({id,pic,link,title} = {})=>{
// 		if(typeof  id === 'undefined'){
// 			return '';
// 		}
// 		return `<a href="${link}">
// 						<div><img src="${pic}" alt=""></div>
// 						<span>${title}</span>
// 						</a>`
// 	};
// 	let  $boxList = $('.flowBox > li');
// 			$boxList = [].slice.call($boxList);
// 	for (let i = 0; i < imgDate.length; i +=4) {
// 		let  item1 = imgDate[i],
// 				item2 = imgDate[i+1],
// 				item3 = imgDate[i+2],
// 				item4 = imgDate[i+3];
// 		$boxList.sort((a,b)=>{
// 			return a.offsetHeight - b.offsetHeight;
// 		}).forEach((curLi,index)=>{
// 			curLi.innerHTML += queryHTML(eval('item' + (index  + 1)));
// 		});
// 	}

//数据绑定二
	let bindHTMl = function(){
		let $boxList = $('.flowBox > li');
		for (let i = 0; i < imgDate.length; i += 4) {
			$boxList.sort((a,b)=>{
				return $(a).outerHeight() - $(b).outerHeight();
			}).each((index,curLi)=>{
				let item = imgDate[i + index];
				if(!item) return ;
				let {id,pic,link,title} = item;
				$(`<a href="${link}">
				<div><img src="${pic}" alt=""></div>
				<span>${title}</span>
				</a>`).appendTo($(curLi));
			});
		}
		running = false;
	};
	bindHTMl();

//加载更多
	$(window).on('scroll',()=>{
		let winHeight = $(window).outerHeight(),
			 pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight,
			 scrollT = $(window).scrollTop();
		if((scrollT + 100) > pageHeight - winHeight){
			if(running) return;
			running = true;
			if(page >= 5) return;
			queryDate();
			bindHTMl();
		}
	})

	//回到顶部
	$('.toTop').on('click',function(){
		let duration = 500,
			 interval = 10,
			 distance = $(window).scrollTop(),
			 step = (distance / duration)*interval;
		let timer = setInterval(()=>{
			let toScrollTop = $(window).scrollTop();
			if(toScrollTop <= 0){
				clearInterval(timer);
				window.onscroll = showBtn;
				return;
			}
			toScrollTop -= step;
			$(window).scrollTop(toScrollTop);
		},interval);
	});
	$(window).on('scroll',showBtn);
	function showBtn(){
		let curTop = $(window).scrollTop(),
				pageHeight = $(window).outerHeight(),
				value = curTop >= pageHeight ? 'block' : 'none';
		$('.toTop').css({display:value});
	}
});
