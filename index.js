let m = 5;			// m 排
let n = 7;			// n 列
let map = [ 		// 电影院座位表
[0, 0, 0, 0, 0, 0, 0], 
[0, 1, 0, 0, 0, 0, 0],
[1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1],
[1, 1, 1, 1, 1, 1, 1]];

/**
 @method getSeat
 *
 @param {Number} num > 0 && num < 5 需要自动进行选座的人数
 *
 @return {Array} 包含的坐标值，例如 [{x: 1, y: 1}, {x: 2, y: 2}]
 */
function getSeat(num) {
	/**
	选座原则：前提当前 num 一定有解，是否有解可以提前判断并对按钮进行disabled操作
	1.后三排为最佳观影位置
	2.如整个座位表有已占位置，那么优先挨着已选座的位置选座
	*/
	let selected = [];
	let empty = [];
	for(let i = 0; i < map.length; i++) {
		let s = 0;
		for(let j = 0; j < map[i].length; j++) {
			if(map[i][j]) {
				if(typeof selected[i] === 'undefined') selected[i] = [];
				selected[i].push(j);
			}
			if(j + 1 < map[i].length) {
				if(map[i][j] && !map[i][j + 1]) s = j + 1;
				if(!map[i][j] && map[i][j + 1]) {
					if(typeof empty[i] === 'undefined') empty[i] = [];
					empty[i].push({s: s, e: j});
					s = -1;
				}
			}
			if(j == map[i].length - 1 && s != -1)  {
				if(typeof empty[i] === 'undefined') empty[i] = [];
				empty[i].push({s: s, e: j});
			}
		}
	}
	let res = [];	// 最终的返回值
	// 此处认为实际影院最小为 4 列，3排。（参考猫眼电影，如有类似情侣厅，则 num < 3）
	if(!selected.length) {
		let mid = Math.ceil(n / 2);
		let s = mid - Math.ceil(num / 2);
		for(let i = 0; i < num; i++)
			res.push({x: m - 4, y: s + i});
		return res;
	}
	/**
	阈值分配：
	f1（排）:即排数，如 1 排，值为 1
	f2（列）：中间权值最高，如果为奇数 5：值为 1 2 3 2 1。如果为偶数 6：值为 1 2 3 3 2 1
	f = f1(1) * f2(1) + f1(2) * f2(2) + ... + f1(n) * f2(n)
	选定一个最高的 f 作为返回值  
	*/
	let f1 = [];
	let f2 = [];
	for(let i = 0; i < m - 3; i++) {
		f1.push(i + 1);
	}
	f1.push(m); f1.push(m - 1); f1.push(m - 2);
	if(n & 1) {
		for(let i = 0; i < Math.floor(n / 2); i++)
			f2.push(i + 1);
		f2.push(Math.ceil(n / 2));
		for(let i = Math.floor(n / 2); i > 0; i--)
			f2.push(i);
	} else {
		for(let i = 0; i < n / 2; i++)
			f2.push(i + 1);
		f2.push(n / 2);
		f2.push(n / 2);
		for(let i = n / 2; i > 0; i--)
			f2.push(i);
	}
	let max = {
		m: -1,
		s: -1,
		val: -1
	};
	// 内嵌两个for循环时间复杂度基本可忽略不计
	for(let i = 0; i < map.length; i++) {
		if(typeof empty[i] !== 'undefined') {
			for(let j = 0; j < empty[i].length; j++) {
				let s = parseInt(empty[i][j].s);
				let e = parseInt(empty[i][j].e);
				if(e - s + 1 >= num) {
					if(s == 0 && e == n - 1)
						s = Math.ceil(n / 2) - Math.ceil(num / 2);
					let sum = 0;
					if(f2[e] > f2[s]) {
						for(let k = 0; k < num; k++) sum += f2[e - k] * f1[i];
					} else {
						for(let k = 0; k < num; k++) sum += f2[s + k] * f1[i];
					}
					if(sum > max.val) {
						max.m = i;
						max.s = s;
						max.val = sum;
					}
				}
			}
		}
	}
	for(let i = 0; i < num; i++)
		res.push({
			x: max.m,
			y: max.s + i
		});
	return res;
}

console.log(getSeat(3));