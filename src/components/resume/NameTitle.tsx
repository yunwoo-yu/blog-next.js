import React from 'react';

const NAME_TITLE = {
	이름: '유윤우',
	직업: 'Front-End Developer',
};

export default function NameTitle() {
	return (
		<div className="flex flex-col gap-3">
			{Object.entries(NAME_TITLE).map(([key, value]) => (
				<div key={key}>
					<dt className="sr-only">{key}</dt>
					<dd className={key !== '이름' ? 'text-2xl' : 'text-4xl font-bold'}>{value}</dd>
				</div>
			))}
		</div>
	);
}
