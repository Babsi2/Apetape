<?PHP
	class user_IndexedSearch
	{
		function prepareResultRowTemplateData_postProc($tmplContent, $row, $headerOnly)
		{
			preg_match('/href="(.*)"/i', $tmplContent['title'], $matches);
			
			$tmplContent['link'] = '<a href="'.$matches[1].'">http://' . $_SERVER['HTTP_HOST'] . '/' . $matches[1] . '</a>';
			$tmplContent['title'] = user_getPageTitle(unserialize($row['cHashParams']), $row['page_id'], true);

			return $tmplContent;
		}
	};
?>