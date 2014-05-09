<?PHP
	/***************************************************************
	* Database and in Memory Filter and Sorting Classes
	* $Id$
	***************************************************************/
	
	require_once(PATH_site . 'fileadmin/inc/class.Utils.php');

	/**
	 * Class for Sorting in-memory objects or create sql statements for sorting in MySQL databases
	 */
	class Sorting {
		protected $next = null;
		protected $field = "";
		protected $dir = "";
		protected $table = "";

		public function Sorting($field, $dir=SORT_ASC, $table="") {
			$this->field = $field;
			$this->dir = $dir;
			$this->table = $table;
		}

		public static function Build($field, $dir=SORT_ASC, $table="") {
			return new Sorting($field, $dir, $table);
		}

		public function Append($sorting, $dir=SORT_ASC, $table="") {
			if ($table=="")
				if ($this->table!="")
					$table = $this->table;

			if (!is_a($sorting, "Sorting"))
				$sorting = new Sorting($sorting, $dir, $table);

			if ($this->next != null)
				$this->next->append($sorting);
			else
				$this->next = $sorting;

			return $this;
		}

		public function ToString() {
			$dir = $this->dir == SORT_ASC ? ' ASC' : ' DESC';

			if ($this->table)
				$value .= $this->table . '.';

			$value .= $this->field . $dir;
			if($this->next != null)
				$value .= ', ' . $this->next->ToString();

			return $value;
		}

		public function __ToString() {
			return $this->ToString();
		}

		public function process($data) {
			/*if ($this->next != null)
				$data = $this->next->process($data);

			uasort($data, array($this, "compare"));
			return $data;*/

			return $this->MultiSort($data, $this->getPrepareValue());
		}

		protected function getPrepareValue() {
			$v = array($this->field => array($this->dir));

			if ($this->next != null)
				$v = array_merge($v, $this->next->getPrepareValue());

			return $v;
		}
		protected function MultiSort($array, $cols) {
		    $colarr = array();
		    foreach ($cols as $col => $order)
		    {
		        $colarr[$col] = array();
		        foreach ($array as $k => $row)
		        {
		            $colarr[$col]['_'.$k] = strtolower($row[$col]);
		        }
		    }
		    $params = array();
		    foreach ($cols as $col => $order)
		    {

		        $params[] =&$colarr[$col];
		        $order=(array)$order;
		        foreach($order as $order_element)
		        {
		            //pass by reference, as required by php 5.3
		            $params[]=&$order_element;
		        }
		    }
		    call_user_func_array('array_multisort', $params);
		    $ret = array();
		    $keys = array();
		    $first = true;
		    foreach ($colarr as $col => $arr)
		    {
		        foreach ($arr as $k => $v)
		        {
		            if ($first)
		            {
		                $keys[$k] = substr($k,1);
		            }
		            $k = $keys[$k];

		            if (!isset($ret[$k]))
		            {
		                $ret[$k] = $array[$k];
		            }

		            $ret[$k][$col] = $array[$k][$col];
		        }
		        $first = false;
		    }
		    return $ret;
		}
	}


	/**
	 * Operator Enumeration
	 * @remarks usage eg.: Operator::Equals()
	 */
	enum('Operator', array(
		'Equals',
		'NotEquals',
		'Like',
		'NotLike',
		'LessThan',
		'LessThanOrEquals',
		'GreaterThan',
		'GreaterThanOrEquals',
		'In',
		'NotIn'
	));

	/**
	 * Abstract class for building criteria following the composite pattern
	 */
	abstract class ACriteria extends pBase{
		public abstract function Add(ACriteria $filter);
		public abstract function Process(array $data);
		public abstract function ToString();

		public function __ToString() {
			return $this->ToString();
		}
	}

	/**
	 * Class for holding a list of criterias or criterialists
	 */
	class CriteriaList extends ACriteria {
		protected $operator;
		protected $criterias = array();

		/**
		 * Creates a new list of criterias
		 * @param op Logical operator used for joining
		 */
		public function CriteriaList($op = 'AND') {
			$this->operator = $op;
		}

		public function Process(array $data) {
			$results = array();
			$result = array();

			foreach($this->criterias as $criteria) {
				$results[] = $criteria->Process($data);
			}

			if ($this->operator == 'AND')
				$result = array_intersect_assoc($results);
			else if ($this->operator == 'OR')
				$result = array_merge($results);
			else
				throw new Exception('Invalid Operator');

			return $result;
		}

		public function ToString() {
			$result = array();

			foreach ($this->criterias as $criteria) {
				$result[] = $criteria->ToString();
			}

			if (count($result) > 0)
				return '(' . implode(' ' . $this->operator . ' ', $result) . ')';

			return "";
		}

		public function Add(ACriteria $criteria) {
			$this->criterias[] = $criteria;
			return $this;
		}


		public function __ToString() {
			return $this->ToString();
		}
	}

	/**
	 * A simple criteria class that can be used to filter data in memory or create MySQL where clauses on database level
	 */
	class Criteria extends ACriteria {
		protected $key;
		protected $value;
		protected $operator = '=';
		protected $table;


		public static function Build($key, $value, $operator=null, $table="") {
			return new Criteria($key, $value, $operator, $table);
		}

		/**
		 * Creates a new single criteria
		 * @param key the column name or array key used for comparing
		 * @param value to be compared
		 * @param operator @see enum Operator
		 * @param table optional table name used for generating sql statements
		 */
		public function Criteria($key, $value, $operator=null, $table="") {
			$this->key = $key;
			$this->value = $value;
			if ($operator === null)
				 $operator = Operator::Equals();
			$this->operator = $operator;
			$this->table = $table;
		}

		/**
		 * Returns a sql equivalent representation of the filter
		 */
		public function ToString() {
			$prepend = $this->table ? $this->table . '.' : '';
			$value = is_numeric($this->value) ? $this->value : '\'' . $this->value . '\'';
			return $prepend . $this->key . ' ' . $this->getOperatorBegin($this->operator, !isset($this->value)) . ' ' . $value . $this->getOperatorEnd($this->operator);
		}

		public function Process(array $data) {
			$result = array();
			foreach ($data as $key => &$row) {
				if ($this->compare($row[$this->key], $this->value))
					$result[$key] = $row;
			}
			return $result;
		}

		protected function compare($value1, $value2) {
			/*switch($this->operator) {
				case '=':return $value1 == $value2;
				case '!=':return $value1 != $value2;
				case '>':return $value1 > $value2;
				case '<':return $value1 < $value2;
				case '<=':return $value1 <= $value2;
				case '>=':return $value1 >= $value2;
				case 'like':return stripos($value2, $value1) !== false; // TODO: correct Implementation

				default:throw new Exception('Not implemented yet.');
			}*/

            switch ($this->operator)
            {
                case Operator::Equals():
                    return $value1 == $value2;
                case Operator::NotEquals():
                    return $value1 != $value2;
                case Operator::Like():
                    return stripos($value2, $value1) !== false; // TODO: correct Implementation
                case Operator::NotLike():
                    return stripos($value2, $value1) === false; // TODO: correct Implementation
                case Operator::LessThan():
                    return $value1 < $value2;
                case Operator::LessThanOrEquals():
                    return $value1 <= $value2;
                case Operator::GreaterThan():
                    return $value1 > $value2;
                case Operator::GreaterThanOrEquals():
                    return $value1 >= $value2;
                case Operator::In():
                    return stripos($value2, $value1) !== false; // TODO: correct Implementation
                case Operator::NotIn():
                    return stripos($value2, $value1) === false; // TODO: correct Implementation
                default:
                    return ""; // TODO: Error
            }
		}

		public function Add(ACriteria $criteria) {
			throw new Exception("It's not possible to add to an leaf");
		}

		/**
		 * Returns the first sql substring for the given Operator
		 */
		protected function getOperatorBegin($operator, $isNullValue=false) {
            switch ($operator)
            {
                case Operator::Equals():
                    return $isNullValue ? "is" : "=";
                case Operator::NotEquals():
                    return $isNullValue ? "is not" : "!=";
                case Operator::Like():
                    return "like";
                case Operator::NotLike():
                    return "not like";
                case Operator::LessThan():
                    return "<";
                case Operator::LessThanOrEquals():
                    return "<=";
                case Operator::GreaterThan():
                    return ">";
                case Operator::GreaterThanOrEquals():
                    return ">=";
                case Operator::In():
                    return "in (";
                case Operator::NotIn():
                    return "not in (";
                default:
                    return ""; // TODO: Error
            }
		}

		/**
		 * Return the second sql substring for the given Operator
		 */
		protected function getOperatorEnd($operator){
            if ($operator == Operator::In() || $operator == Operator::NotIn())
                return ")";
            else
                return "";
        }

        /**
         * Formats the value, returns "null" if value is null
         */
        protected function getValue($value) {
        	if (isset($value))
        		return "null";
        	else
        		return (string)$value;
        }


		public function __toString() {
			return $this->ToString();
		}
	}

?>