<?PHP
	
	/**
	 * Class for generating HTML-Tables
	 * 
	 * @author Barbara Huber
	 * @version $Id$
	 * @access public
	 */
	class Table {
		
		/**
		 * Get/Set the header row
		 * @var mixed
		 */
		public $header;
		/**
		 * Get/Set footer rows
		 * @var mixed
		 */
		public $footer;
		/**
		 * Get/Set the body rows
		 * @var mixed
		 */
		public $body;
		/**
		 * Get/Set the classes for each row
		 * @var mixed
		 */		 
		public $classes;
		
		/**
		 * Get/Set the char used for separating cells
		 * @var string
		 */
		public $rowSeparator = "\n"; 
		
		
		/**
		 * Get/Set the string used to display, when the body is empty
		 * @var string
		 */
		public $noBody = "";
		
		/**
		 * Get/Set the char used for separating cells
		 * @var string
		 */
		public $colSeparator = '|';
		
		public $attributes = array();
		
		/** List of valid cell attributes (deprecated attributes are ommited)
		 */
		protected static $validCellAttributes = array(
			// Event Attributes
			'onclick','ondblclick','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup','onkeydown','onkeypress','onkeyup',
			// Standard Attributes
			'class','dir','id','lang','style','title','xml:lang',
			// Optional Attributes
			'axis','char','charoff','colspan','headers','rowspan','scope','valign'
		);
			
		/** List of valid table attributes (deprecated attributes are ommited)
		 */
		protected static $validTableAttributes= array(
			// Event Attributes
			'onclick','ondblclick','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup','onkeydown','onkeypress','onkeyup',
			// Standard Attributes
			'class','dir','id','lang','style','title','xml:lang',
			// Optional Attributes
			'cellpadding','cellspacing','frame','rules','summary'
		);
		
		
        /**
         * Renders a table cell
		 * Tables::renderDataTableCell()
         * 
         * @param string $cell The content of the cell to be rendered
         * @param string $class The class of the cell
         * @param string $width optional style of the cell
         * @param string $colspan optional colspan of the cell
         * @param string $cellType optional type of the rendered cell
         * @return string
         */
        protected function renderTableCell($cell, $class, $attributes="", $colspan="", $cellType='td') {			
			if ($colspan)
				$colspan = 'colspan="'  . $colspan . '"';

			if (is_array($cell)) {
				foreach($cell as $key => $value) {
					if (in_array($key, self::$validCellAttributes)){
						if ($key == 'class') {
							$class = $value; continue;
						}
						
						
						$attributes .= <<< HTML
 {$key}="{$value}"
HTML;
}
				}
				
				$cell = $cell['content'];
			}

        	return <<<HTML

				<{$cellType} class="{$class}" {$colspan} {$attributes}>{$cell}</{$cellType}>
HTML;
        }
        
        /**
         * Renders a table row
		 * Tables::renderDataTableRow()
         * 
         * @param array $row
         * @param string $rowClass The class of the row
         * @param int $nums the number of cells to be rendered
         * @param array $classes optional array containing class names for the cells
         * @param array $attributes optional array containing style definitions for the cell
         * @param bool $isHead optional indicator if the row is a head or body row
         * @return string
         */
        protected function renderTableRow($row, $rowClass, $nums, $classes="", $attributes="", $isBody=true) {
        	
        	$firstKey = reset(array_keys($row));
        	$lastKey= end(array_keys($row));
        	
			$last = min($nums, count($row));
			        	
       		foreach($row as $key => $cell) {
       			$i++;
       			if ($last == $i)
       				$colspan = $nums - $i + 1;
					   	
				$cClass = $classes[$i-1];
       			if ($key == $firstKey)
       				$cClass .= ' first';
       				
				if ($key == $lastKey)
					$cClass .= ' last';		
 				
 				$cellType = $isBody ? 'td' : 'th';
       			$content .= $this->renderTableCell($cell, $cClass, $attributes[$key], $colspan, $cellType);

       		}       	
        	
        	return <<<HTML
			<tr class="$rowClass">{$content}
			</tr>

HTML;
        }
        
        
		/**
		 * Parses a table object from a given string 
		 * Tables::FromString()
		 * 
		 * @return void
		 */
		public static function FromString($data, $rowSeparator="\n", $colSeparator="|") {
			$table = new Table();
			
        	$rows = explode($rowSeparator, $data);
        	foreach($rows as &$row) {
        		$row = explode($colSeparator, $row);
        	}
        	
        	
        	$table->colSeparator = $colSeparator;
        	$table->rowSeparator = $rowSeparator;
        	$table->header = array_shift($rows);
        	$table->body = $rows;
        	
        	return $table;
        }
        
        public function ToString() {
        	return $this->Render();
        }
        
        public function ToCSV($separator=';', $lineChar="\n") {
			if ($this->header) {
				if (!is_array($this->header))
					$header = explode(self::$separatorChar, $this->header);
				else 
					$header = $this->header;
				foreach($header as &$h)
					$h = '"' . $h . '"';
				
				$content[] = implode($separator, $header);
			}
			if ($this->body) {
				$max = 0;
				foreach($this->body as $row)
					$max = max(count($row), $max);
					
				foreach($this->body as $row) {
					$tmp = array();
					for ($i=0;$i<$max;$i++) {
						$tmp[] = $row[$i];
					}
					$content[] = implode($separator,$tmp);
				}	
			}
			if ($this->footer) {
				if (!is_array($this->footer))
					$footer = explode(self::$separatorChar, $this->footer);
				else 
					$footer = $this->footer;
				foreach($footer as &$f)
					$f = '"' . $f . '"';
				
				$content[] = implode($separator, $footer);
			}
			
			return implode($lineChar, $content);
        }
        
		/**
		 * Renders a HTML-Table
		 * Tables::renderDataTable()
		 *
		 * @param array $data an configuration Array
		 * @param string $class optional class name for the table (default="dataTable")
		 * @return string
		 * 
		 * @example
		 * 
		 * array(
		 * 		'attributes' => array()
		 * 		'header' => array('col1', 'col2', 'col3'),
		 * 		'classes' => array('col1', 'col2', 'col3'),
		 * 		'body' => array(
		 * 			array('data00','data01','data02'),
		 * 			array('data10','data11','data12'),
		 * 			array('data20','data21','data22'),
		 * 		),
		 * 		'footer' => array('footer1','footer2','footer3')
		 * )
		 *  
		 */
		public function Render($class="dataTable") {
        	
			// asume that first row, contains all cells
			$nums = min(1,count($this->body[0]));        	
        	$hasHeader = is_array($this->header);

			if ($this->header) {
				$hClass = $hasHeader ? 'header' : 'singleHeader';
				
				if (!is_array($this->header))
					$this->header = explode($this->colSeparator, $this->header); 
					
				$nums = max($nums, count($this->header));				
        		$header = $this->renderTableRow($this->header, $hClass, $nums, $this->classes, "", false);
        	}
        	
        	if ($this->footer) {
				$hClass = is_array($this->footer) ? 'footer' : 'singleFooter';
				
				if (!is_array($this->footer))
					$this->footer = explode($this->colSeparator, $this->footer); 
				
        		$footer = $this->renderTableRow($this->footer, $hClass, $nums, $this->classes);        		
        	}
        	
        	$firstKey = reset(array_keys($this->body));
        	$lastKey = end(array_keys($this->body));
			
			if ($this->body == null && $this->noBody) {
				$rows .= $this->renderTableRow(array($this->noBody), "noBody", $nums);
			}
			else {
	        	foreach($this->body as $key => $row) {
	        		$rClass = ($key % 2 == 1) ? 'even' : 'odd';
	        		
	        		if ($key == $firstKey)
	        			$rClass .= ' first';
	        			
	       			if ($key == $lastKey)
	       				$rClass .= ' last';
	        		
					$rows .=  $this->renderTableRow($row, $rClass, $nums, $this->classes);
	        	}
        	}
        	
        	if (is_array($this->attributes)) {
				foreach($this->attributes as $key => $value) {
					if (in_array($key, self::$validTableAttributes))
						$attributes .= <<< HTML
 {$key}="{$value}"
HTML;
				}
			}
			
        	
        	return <<< HTML
	<table class="{$class}" {$attributes}>
		<thead>
{$header}
		</thead>
		<tbody>
{$rows}
		</tbody>
		<tfoot>
{$footer}
		</tfoot>
	</table>
HTML;
        }
	}

?>