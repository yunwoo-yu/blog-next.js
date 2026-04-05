import 'react';

declare module 'react' {
	function ViewTransition(props: { name?: string; children: React.ReactNode }): React.ReactElement;
}
