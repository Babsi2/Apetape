<?PHP
	/***************************************************************
	* Base Class that all pixelart specific classes should extend
	* It contains some general behavior for better coding und debugging
	*
	* $Id: class.pBase.php 14 2010-01-13 13:53:42Z mwallner $
	*
	* Check for the newest version at http://forge.pixelart.at/redmine/repositories/show/framework
	***************************************************************/
	
	/**
	 * Base pixelart class
	 */
	abstract class pBase { 
		/////////////////////////////////////////////////////////////////////////////
		// Configuration Section
		/////////////////////////////////////////////////////////////////////////////
		public $config = array(
			'debug' => 4
		);
		
		/////////////////////////////////////////////////////////////////////////////
		// Debugging
		/////////////////////////////////////////////////////////////////////////////
		
		/**
		 * Echos the message or array if the given severity is higher the configured one
		 * @param data	the data that should be logged
		 * @param severity	the severity to check against, only debugs message with higher severity than configured
		 * @param forcePrintR	force a print_r to print the structure of the object
		 */
		protected function debug($data, $severity=1, $forcePrintR=false) {
			if($this->config['debug'] >= $severity) {
				if ($forcePrintR || is_array($data))
					$data = "\n" . print_r($data, true);
				
				print strftime("%Y-%m-%d %H:%M:%S") . ' [' . get_class($this)  . ']: ' . $data . "\n";
				flush();
				ob_flush();
			}
		}
	}
	
	/**
	 * a function for generating type safe, iterable, singleton enumerations.
	 */
	function enum($base_class, array $args) {
	    $class_parts = preg_split('/\s+/', $base_class);
	    $base_class_name = array_shift($class_parts);
	    $enums = array();

	    foreach ($args as $k => $enum) {
	        $static_method = 'public static function ' . $enum .
	            '() { return ' . $enum . '::instance(); }';
	        $enums[$static_method] = '
	            class ' . $enum . ' extends ' . $base_class_name . '{
	                private static $instance = null;
	                protected $value = "' . addcslashes($k, '\\') . '";
	                private function __construct() {}
	                private function __clone() {}
	                public static function instance() {
	                    if (self::$instance === null) { self::$instance = new self(); }
	                    return self::$instance;
	                }
	            }';
	    }

	    $base_class_declaration = sprintf('
	        abstract class %s {
	            protected $value = null;
	            %s
	            public static function iterator() { return %sIterator::instance(); }
	            public function value() { return $this->value; }
	            public function __toString() { return (string) $this->value; }
	        };',
	        $base_class,
	        implode(PHP_EOL, array_keys($enums)),
	        $base_class_name);

	    $iterator_declaration = sprintf('
	        class %sIterator implements Iterator {
	            private static $instance = null;
	            private $values = array(\'%s\');
	            private function __construct() {}
	            private function __clone() {}
	            public static function instance() {
	                if (self::$instance === null) { self::$instance = new self(); }
	                return self::$instance;
	            }
	            public function current() {
	                $value = current($this->values);
	                if ($value === false) { return false; }
	                return call_user_func(array(\'%s\', $value));
	            }
	            public function key() { return key($this->values); }
	            public function next() {
	                next($this->values);
	                return $this->current();
	            }
	            public function rewind() { return reset($this->values); }
	            public function valid() { return (bool) $this->current(); }
	        };',
	        $base_class_name,
	        implode('\',\'', $args),
	        $base_class_name);

	    eval($base_class_declaration);
	    eval($iterator_declaration);
	    eval(implode(PHP_EOL, $enums));
	}
	
?>